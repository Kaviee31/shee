import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";
import { LineChart } from "react-native-chart-kit";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

const SleepTrackerScreen = ({ navigation }) => {
    const [sleepStart, setSleepStart] = useState("");
    const [sleepEnd, setSleepEnd] = useState("");
    const [sleepData, setSleepData] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) fetchSleepData();
    }, [user]);

    const fetchSleepData = async () => {
        try {
            const q = query(collection(db, "sleepLogs"), where("userId", "==", user.uid)); // Fetch data for logged-in user
            const querySnapshot = await getDocs(q);
            const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const validLogs = logs.filter(log =>
                !isNaN(new Date(log.sleepStart)) && !isNaN(new Date(log.sleepEnd))
            );

            setSleepData(validLogs);
        } catch (error) {
            console.error("Error fetching sleep data:", error);
        }
    };

    const saveSleepData = async () => {
        if (!sleepStart || !sleepEnd || !user) return;

        let startTime = new Date();
        let endTime = new Date();

        let [startHour, startMinute] = sleepStart.split(":").map(Number);
        let [endHour, endMinute] = sleepEnd.split(":").map(Number);

        startTime.setHours(startHour, startMinute, 0);
        endTime.setHours(endHour, endMinute, 0);

        if (endTime <= startTime) {
            endTime.setDate(endTime.getDate() + 1); // Adjust for overnight sleep
        }

        const duration = (endTime - startTime) / (1000 * 60 * 60); // Convert ms to hours

        if (isNaN(duration) || duration <= 0) {
            console.error("Invalid sleep duration", duration);
            return;
        }

        try {
            await addDoc(collection(db, "sleepLogs"), {
                userId: user.uid,  // Store logged-in user's ID
                sleepStart: startTime.toISOString(),
                sleepEnd: endTime.toISOString(),
                sleepDuration: duration,
                date: new Date().toISOString(),
            });

            setSleepStart("");
            setSleepEnd("");
            fetchSleepData();
        } catch (error) {
            console.error("Error saving sleep data:", error);
        }
    };

    const scheduleNotification = () => {
        PushNotification.localNotificationSchedule({
            message: "Time to sleep!",
            date: new Date(Date.now() + 60 * 1000),
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Sleep Tracker</Text>
            <View style={styles.card}>
                <TextInput style={styles.input} placeholder="Sleep Start (HH:MM)" value={sleepStart} onChangeText={setSleepStart} />
                <TextInput style={styles.input} placeholder="Sleep End (HH:MM)" value={sleepEnd} onChangeText={setSleepEnd} />
                <TouchableOpacity style={styles.button} onPress={saveSleepData}>
                    <Text style={styles.buttonText}>Save Sleep Data</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.reminderButton]} onPress={scheduleNotification}>
                    <Text style={styles.buttonText}>Set Reminder</Text>
                </TouchableOpacity>
            </View>

            {sleepData.length > 0 && (
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Your Sleep Duration Trends</Text>
                    <LineChart
                        data={{
                            labels: sleepData.map((_, index) => `Day ${index + 1}`),
                            datasets: [{ data: sleepData.map(log => Number(log.sleepDuration) || 0) }],
                        }}
                        width={Dimensions.get("window").width - 40}
                        height={250}
                        chartConfig={{
                            backgroundColor: "#f4f4f4",
                            backgroundGradientFrom: "#6a11cb",
                            backgroundGradientTo: "#2575fc",
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        bezier
                        style={{ marginVertical: 10, borderRadius: 16 }}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 40, backgroundColor: "#f8f9fa", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
    card: { backgroundColor: "#fff", padding: 20, borderRadius: 10, elevation: 3 },
    input: { borderWidth: 1, padding: 12, marginVertical: 10, borderRadius: 5, borderColor: "#ddd" },
    button: { backgroundColor: "#6a11cb", padding: 12, borderRadius: 5, alignItems: "center", marginVertical: 5 },
    reminderButton: { backgroundColor: "#2575fc" },
    buttonText: { color: "#fff", fontWeight: "bold" },
    chartContainer: { backgroundColor: "#fff", padding: 15, marginTop: 10, borderRadius: 10, elevation: 3 },
    chartTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
});

export default SleepTrackerScreen;
