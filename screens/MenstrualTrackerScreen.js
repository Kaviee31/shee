import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, FlatList, TextInput, ScrollView, Alert, StyleSheet 
} from "react-native";
import { Calendar } from "react-native-calendars";
import { collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const MenstrualTracker = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [cycleData, setCycleData] = useState([]);
  const [lastPeriodDate, setLastPeriodDate] = useState(null);
  const cycleLength = 28; // Average cycle length

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
          where("userId", "==", user.uid), // Fetch only logged-in user's data
          orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setCycleData(data);
        if (data.length > 0) {
          setLastPeriodDate(data[0].date);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate cycle progress
  const calculateCycleProgress = () => {
    if (!lastPeriodDate) return 0;
    
    const today = new Date();
    const lastPeriod = new Date(lastPeriodDate);
    const daysSinceLastPeriod = Math.ceil((today - lastPeriod) / (1000 * 60 * 60 * 24));
    
    return Math.min(100, (daysSinceLastPeriod / cycleLength) * 100);
  };

  const daysLeftForNextCycle = () => {
    if (!lastPeriodDate) return cycleLength;
    
    const today = new Date();
    const lastPeriod = new Date(lastPeriodDate);
    const daysSinceLastPeriod = Math.ceil((today - lastPeriod) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, cycleLength - daysSinceLastPeriod);
  };

  const logCycle = async () => {
    if (!selectedDate) return Alert.alert("Error", "Please select a date!");

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    try {
      await addDoc(collection(db, "menstrual_cycles"), { 
        userId: auth.currentUser.uid,  // Store the user’s UID
        date: selectedDate, 
        symptoms,
        loggedAt: new Date().toISOString() 
      });

      const newEntry = { date: selectedDate, symptoms };
      setCycleData([newEntry, ...cycleData]);
      setLastPeriodDate(selectedDate);
      setSymptoms("");
      Alert.alert("Success", "Period logged successfully!");
    } catch (error) {
      console.error("Error logging cycle:", error);
      Alert.alert("Error", "Failed to log data");
    }
  };

  const cycleProgress = calculateCycleProgress();
  const daysLeft = daysLeftForNextCycle();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Menstrual Cycle Tracker</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{ 
          [selectedDate]: { selected: true, selectedColor: "red" },
          ...cycleData.reduce((acc, item) => {
            acc[item.date] = { marked: true, dotColor: "#d63384" };
            return acc;
          }, {})
        }}
        theme={{ selectedDayBackgroundColor: "#d63384", arrowColor: "#6a0572" }}
      />

      <Text style={styles.selectedDate}>
        Last Period: {lastPeriodDate ? new Date(lastPeriodDate).toDateString() : "Not Logged"}
      </Text>

      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={120}
          width={10}
          fill={cycleProgress}
          tintColor={cycleProgress >= 100 ? "green" : "#d63384"}
          backgroundColor="#ddd"
        />
        <Text style={styles.progressText}>
          {cycleProgress >= 100 ? 
            "Cycle overdue!" : 
            `Next cycle in: ${daysLeft} days`}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Log symptoms (e.g., cramps, headache)"
        value={symptoms}
        onChangeText={setSymptoms}
        multiline
      />

      <TouchableOpacity style={styles.logButton} onPress={logCycle}>
        <Text style={styles.logButtonText}>Log New Period</Text>
      </TouchableOpacity>

      <Text style={styles.loggedDataHeader}>Period History</Text>

      <FlatList
        data={cycleData}
        keyExtractor={(item) => item.id }
        renderItem={({ item }) => (
          <View style={styles.loggedItem}>
            <Text style={styles.loggedDate}>{new Date(item.date).toDateString()}</Text>
            <Text style={styles.loggedSymptoms}>
              {item.symptoms || "No symptoms logged"}
            </Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  selectedDate: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  progressContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  logButton: {
    backgroundColor: "#d63384",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  logButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loggedDataHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  loggedItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  loggedDate: {
    fontWeight: "bold",
    fontSize: 16,
  },
  loggedSymptoms: {
    color: "#666",
    marginTop: 5,
  },
});

export default MenstrualTracker;
