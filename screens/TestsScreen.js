import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig"; // Import Firebase instances
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";

const TestsScreen = ({ navigation }) => {
  const [testStatus, setTestStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [testDate, setTestDate] = useState("");

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchTestStatus(currentUser.uid);
    }
  }, []);

  // Fetch test status from Firebase
  const fetchTestStatus = async (userId) => {
    try {
      const testRef = doc(collection(db, "tests"), userId);
      const testSnap = await getDoc(testRef);

      if (testSnap.exists()) {
        const data = testSnap.data();
        setTestStatus(data.status);
        setTestDate(data.date);
      } else {
        setTestStatus("Not Completed");
      }
    } catch (error) {
      console.error("Error fetching test data:", error);
    }
  };

  // Save test status to Firebase
  const saveTestStatus = async () => {
    if (!user) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const testRef = doc(db, "tests", user.uid);

    try {
      await setDoc(testRef, { status: "Completed", date: today }, { merge: true });
      setTestStatus("Completed");
      setTestDate(today);
      Alert.alert("Success", "Test status updated!");
    } catch (error) {
      console.error("Error saving test status:", error);
    }
  };

  // Reminder logic: Alert if test not completed
  const sendReminder = () => {
    if (testStatus !== "Completed") {
      Alert.alert("Reminder", "You have not completed your test yet!");
    } else {
      Alert.alert("All Good", "You have already completed the test.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Tests & Screenings</Text>
      <Text style={styles.info}>Check up on your health with essential tests and screenings.</Text>

      <Text style={styles.status}>Status: {testStatus || "Loading..."}</Text>
      {testDate && <Text style={styles.date}>Last Test: {testDate}</Text>}

      <TouchableOpacity style={styles.scheduleButton} onPress={saveTestStatus}>
        <Text style={styles.buttonText}>Mark as Completed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.reminderButton} onPress={sendReminder}>
        <Text style={styles.buttonText}>Send Reminder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#f4f4f4", padding: 20 , paddingTop:70},
  backButton: { position: "absolute", top: 50, left: 20, padding: 8, backgroundColor: "purple", borderRadius: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "purple", marginBottom: 10 },
  info: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  status: { fontSize: 18, fontWeight: "bold", color: "black", marginVertical: 10 },
  date: { fontSize: 14, color: "gray", marginBottom: 10 },
  scheduleButton: { backgroundColor: "purple", padding: 12, borderRadius: 8, marginTop: 10 },
  reminderButton: { backgroundColor: "red", padding: 12, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default TestsScreen;
