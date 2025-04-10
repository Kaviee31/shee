import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet 
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebaseConfig";
import * as Linking from "expo-linking";

const EmergencyContactScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchEmergencyContacts();
  }, []);

  // ✅ Fetch all emergency contacts from Firebase
  const fetchEmergencyContacts = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not found. Please log in.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setContacts(userDoc.data().emergencyContacts || []);
      } else {
        setContacts([]);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // ✅ Add a new emergency contact (max 3)
  const addEmergencyContact = async () => {
    if (!name || !phone) {
      Alert.alert("Error", "Please enter both name and phone number.");
      return;
    }

    if (contacts.length >= 3) {
      Alert.alert("Limit Reached", "You can only add up to 3 emergency contacts.");
      return;
    }

    const newContact = { id: Date.now().toString(), name, phone };
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not found. Please log in.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        emergencyContacts: arrayUnion(newContact),
      });

      setContacts([...contacts, newContact]);
      setName("");
      setPhone("");
      Alert.alert("Success", "Emergency contact added!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // ✅ Remove a contact from Firebase
  const removeEmergencyContact = async (contact) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not found. Please log in.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        emergencyContacts: arrayRemove(contact),
      });

      setContacts(contacts.filter((c) => c.id !== contact.id));
      setSelectedContact(null);
      Alert.alert("Success", "Emergency contact removed!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // ✅ Call the selected emergency contact
  const callEmergency = () => {
    if (!selectedContact) {
      Alert.alert("No Contact Selected", "Please select a contact to call.");
      return;
    }

    const phoneNumber = `tel:${selectedContact.phone}`;
    Linking.openURL(phoneNumber);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emergency Contacts</Text>

      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={addEmergencyContact}>
        <Text style={styles.buttonText}>Add Contact</Text>
      </TouchableOpacity>

      {/* Display Emergency Contacts (Max 3) */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.contactItem,
              selectedContact?.id === item.id ? styles.selectedContact : {},
            ]}
            onPress={() => setSelectedContact(item)}
          >
            <Text style={styles.contactText}>
              {item.name} - {item.phone}
            </Text>
            <TouchableOpacity onPress={() => removeEmergencyContact(item)}>
              <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[
          styles.callButton,
          { backgroundColor: selectedContact ? "#28a745" : "#007bff" },
        ]}
        onPress={callEmergency}
      >
        <Text style={styles.buttonText}>
          {selectedContact ? `Call ${selectedContact.name}` : "Call Emergency"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmergencyContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#d32f2f",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#d32f2f",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  callButton: {
    padding: 15,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedContact: {
    backgroundColor: "#c3e6cb",
  },
  contactText: {
    fontSize: 16,
  },
  deleteText: {
    color: "#d32f2f",
    fontSize: 18,
  },
});
