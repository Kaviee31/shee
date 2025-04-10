import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  // Handle Signup
  const handleSignup = async () => {
    if (!name || !age || !address || !phone || !email || !password || !emergencyContactName || !emergencyContactPhone) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        age,
        address,
        phone,
        email,
        bloodGroup,
        allergies,
        medicalHistory,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone
        },
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
      <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Blood Group" value={bloodGroup} onChangeText={setBloodGroup} style={styles.input} />
      <TextInput placeholder="Allergies (if any)" value={allergies} onChangeText={setAllergies} style={styles.input} />
      <TextInput placeholder="Medical History" value={medicalHistory} onChangeText={setMedicalHistory} style={styles.input} />

      <Text style={styles.subHeader}>Emergency Contact</Text>
      <TextInput placeholder="Emergency Contact Name" value={emergencyContactName} onChangeText={setEmergencyContactName} style={styles.input} />
      <TextInput placeholder="Emergency Contact Phone" value={emergencyContactPhone} onChangeText={setEmergencyContactPhone} keyboardType="phone-pad" style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f8f9fa", alignItems: "center", padding: 20 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#d32f2f" },
  subHeader: { fontSize: 22, fontWeight: "bold", marginVertical: 15, color: "#333" },
  input: { width: "100%", backgroundColor: "#fff", padding: 15, marginVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  button: { backgroundColor: "#d32f2f", padding: 15, width: "100%", borderRadius: 10, alignItems: "center", marginVertical: 10 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  link: { color: "#d32f2f", fontSize: 16, marginTop: 10 }
});

