import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, FlatList,
  TextInput, ScrollView, Alert, StyleSheet
} from "react-native";
import { Calendar } from "react-native-calendars";
import { collection, addDoc, getDocs, query, orderBy, where, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";

const MenstrualTracker = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [cycleData, setCycleData] = useState([]);
  const [isLoggingStart, setIsLoggingStart] = useState(true);
  const [forecast, setForecast] = useState("");
  const [healthyTip, setHealthyTip] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.log("No user logged in");
          return;
        }

        const q = query(
          collection(db, "menstrual_cycles"),
          where("userId", "==", user.uid),
          orderBy("startDate", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCycleData(data);

        if (data.length > 0) {
          const lastCycleEndDate = data[0].endDate;
          setForecast(getNextPeriodForecast(lastCycleEndDate)); // Set forecast after fetching cycle data
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getNextPeriodForecast = (lastCycleEndDate) => {
    if (!lastCycleEndDate) return "Please log your first cycle to get a forecast.";

    const nextPeriodDate = new Date(lastCycleEndDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + 28); // Calculate the next period as 28 days from the last period's end date
    return `Your next period is forecasted to start on: ${nextPeriodDate.toDateString()}`;
  };

  const handleDateSelect = (day) => {
    if (isLoggingStart) {
      // Ensure end date is not selected before the start date
      if (endDate && new Date(day.dateString) > new Date(endDate)) {
        setStartDate(day.dateString);
      } else {
        setStartDate(day.dateString);
        setIsLoggingStart(false); // Once start date is selected, allow selecting the end date
      }
    } else {
      if (new Date(day.dateString) < new Date(startDate)) {
        Alert.alert("Error", "End date cannot be before start date.");
        return;
      }
      setEndDate(day.dateString);
      setIsLoggingStart(true); // Reset once both dates are selected
    }
  };

  const logCycle = async () => {
    if (!startDate || !endDate) {
      return Alert.alert("Error", "Please select both start and end dates.");
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    try {
      await addDoc(collection(db, "menstrual_cycles"), {
        userId: user.uid,
        startDate,
        endDate,
        symptoms,
        loggedAt: new Date().toISOString()
      });

      const newEntry = { startDate, endDate, symptoms };
      setCycleData([newEntry, ...cycleData]);
      setStartDate("");
      setEndDate("");
      setSymptoms("");
      setHealthyTip(""); // Reset the healthy tip after logging
      Alert.alert("Success", "Cycle logged successfully!");

      // Update the forecast after logging a cycle
      setForecast(getNextPeriodForecast(endDate));
    } catch (error) {
      console.error("Error logging cycle:", error);
      Alert.alert("Error", "Failed to log data");
    }
  };

  const deleteCycle = async (id) => {
    try {
      const docRef = doc(db, "menstrual_cycles", id);
      await deleteDoc(docRef);
  
      // Remove the deleted cycle from the state using id comparison
      const updatedCycleData = cycleData.filter((cycle) => cycle.id !== id);
      setCycleData(updatedCycleData); // Update the state with remaining cycles
      Alert.alert("Success", "Cycle deleted successfully!");
  
      // Update the forecast after deleting a cycle
      if (updatedCycleData.length > 0) {
        const lastCycleEndDate = updatedCycleData[0]?.endDate;
        setForecast(getNextPeriodForecast(lastCycleEndDate)); // Recalculate forecast with the new most recent cycle
      } else {
        setForecast("Please log your cycle to get a forecast.");
      }
    } catch (error) {
      console.error("Error deleting cycle:", error);
      Alert.alert("Error", "Failed to delete cycle.");
    }
  };
  

  const suggestHealthyTip = () => {
    if (symptoms.toLowerCase().includes("cramps")) {
      setHealthyTip("Try applying a warm compress to your lower abdomen for relief.");
    } else if (symptoms.toLowerCase().includes("fatigue")) {
      setHealthyTip("Ensure you're getting enough rest and hydration.");
    } else {
      setHealthyTip("Maintaining a balanced diet and regular exercise can help with your menstrual health.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Menstrual Cycle Tracker</Text>

      <Calendar
        onDayPress={handleDateSelect}
        markedDates={{
          ...(startDate && { [startDate]: { selected: true, selectedColor: "#0d6efd" } }),
          ...(endDate && { [endDate]: { selected: true, selectedColor: "#dc3545" } }),
          ...cycleData.reduce((acc, item) => {
            if (item.startDate) acc[item.startDate] = { marked: true, dotColor: "#0d6efd" };
            if (item.endDate) acc[item.endDate] = { marked: true, dotColor: "#dc3545" };
            return acc;
          }, {}),
        }}
        theme={{
          selectedDayBackgroundColor: "#d63384",
          arrowColor: "#6a0572",
        }}
      />

      <Text style={styles.forecastText}>{forecast}</Text>

      <TextInput
        style={styles.input}
        placeholder="Log symptoms (e.g., cramps, fatigue)"
        value={symptoms}
        onChangeText={setSymptoms}
        multiline
      />

      <TouchableOpacity style={styles.logButton} onPress={() => { logCycle(); suggestHealthyTip(); }}>
        <Text style={styles.logButtonText}>Log Period</Text>
      </TouchableOpacity>

      <Text style={styles.loggedDataHeader}>Period History</Text>

      <FlatList
        data={cycleData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.loggedItem}>
            <Text style={styles.loggedDate}>
              {item.startDate ? `Start: ${new Date(item.startDate).toDateString()}` : "No start date"}
            </Text>
            <Text style={styles.loggedDate}>
              {item.endDate ? `End: ${new Date(item.endDate).toDateString()}` : "No end date"}
            </Text>
            <Text style={styles.loggedSymptoms}>
              {item.symptoms || "No symptoms logged"}
            </Text>
            <TouchableOpacity onPress={() => deleteCycle(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
      />

      {healthyTip && (
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>{healthyTip}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, padding: 20, backgroundColor: "#fff" },
  headerText: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#d63384" },
  forecastText: { fontSize: 16, fontWeight: "bold", marginVertical: 10, textAlign: "center", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 5, marginBottom: 15, fontSize: 16 },
  logButton: { backgroundColor: "#d63384", padding: 15, borderRadius: 5, alignItems: "center" },
  logButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loggedDataHeader: { fontSize: 20, fontWeight: "bold", marginVertical: 20, textAlign: "center", color: "#333" },
  loggedItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  loggedDate: { fontWeight: "bold", fontSize: 16 },
  loggedSymptoms: { color: "#666", marginTop: 5 },
  deleteButton: { backgroundColor: "#dc3545", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
  tipContainer: { backgroundColor: "#f8f9fa", padding: 15, borderRadius: 5, marginTop: 20 },
  tipText: { fontSize: 16, color: "#333" },
});

export default MenstrualTracker;
