import React, { useState, useEffect } from "react";
import { 
    View, Text, Alert, StyleSheet, TouchableOpacity, Vibration 
} from "react-native";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const WomenSafetyScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [emergencyContact, setEmergencyContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmergencyContacts = async (userId) => {
            try {
                const userDocRef = doc(db, "users", userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("User Data from Firebase:", userData);

                    // Assuming emergency contacts are stored as an array of objects
                    const contact = userData.emergencyContact;
                    setEmergencyContact(contact);
                } else {
                    console.log("No user data found.");
                    Alert.alert("No Data Found", "No emergency contacts found in the database.");
                }
            } catch (error) {
                console.error("Error fetching emergency contacts:", error);
                Alert.alert("Error Fetching Data", error.message);
            } finally {
                setLoading(false);
            }
        };

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchEmergencyContacts(user.uid);
            } else {
                console.log("User is not logged in.");
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Enable location services to use this feature.");
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        const { latitude, longitude } = currentLocation.coords;
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=hospitals+and+police+stations&near=${latitude},${longitude}`;
        Linking.openURL(googleMapsUrl);
    };

    const sendSOS = async () => {
        if (!location) {
            Alert.alert("Location Not Available", "Please fetch your location before sending an SOS.");
            return;
        }

        if (!emergencyContact || !emergencyContact.phone) {
            Alert.alert("No Emergency Contacts", "No emergency contacts found in the database.");
            return;
        }

       // const phoneNumbers = emergencyContacts.map(contact => contact.phone);
        const message = `🚨 SOS Alert! I need help. My location: https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            await SMS.sendSMSAsync([emergencyContact.phone], message);
            Alert.alert("SOS Sent", "Your emergency contact (${emergencyContact.name}) has  been notified.");
        } else {
            Alert.alert("SMS Not Available", "Your device does not support SMS sending.");
        }
    };

    const callEmergency = () => {
        if (!emergencyContact || !emergencyContact.phone) {
            Alert.alert("No Emergency Contacts", "No emergency contacts found in the database.");
            return;
        }

        //const firstContact = emergencyContacts[0];
        const phoneNumber = `tel:${emergencyContact.phone}`;
        Linking.openURL(phoneNumber);
        Vibration.vibrate(100);
        Alert.alert("Calling Emergency Contact", `Dialing ${emergencyContact.name}`);
    };

    const callPolice = () => {
        const policeNumber = "100"; // Adjust as per your region
        Linking.openURL(`tel:${policeNumber}`);
        Vibration.vibrate(200); // Stronger vibration for alert
        Alert.alert("Calling Police", "Dialing the police emergency number...");
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading Emergency Contacts...</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={styles.container}>
            <Text style={styles.header}>Women Safety</Text>

            <View style={styles.grid}>
                <TouchableOpacity style={styles.card} onPress={getLocation}>
                    <LottieView
                        source={require("../assets/loc-animation.json")}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                    <Text style={styles.cardText}>Live Location</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={sendSOS}>
                    <LottieView
                        source={require("../assets/sos-animation.json")}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                    <Text style={styles.cardText}>Send SOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={callEmergency}>
                    <LottieView
                        source={require("../assets/call-animation.json")}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                    <Text style={styles.cardText}>Call Emergency</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={callPolice}>
                    <Ionicons name="call" size={40} color="#fff" />
                    <Text style={styles.cardText}>Call Police</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default WomenSafetyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff",
        marginBottom: 30,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20,
    },
    card: {
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    cardText: {
        marginTop: 10,
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
    },
    animation: {
        width: 80,
        height: 80,
    },
    loadingText: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center",
    },
});

