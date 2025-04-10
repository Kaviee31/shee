import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HealthcareScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={30} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Healthcare</Text>
        <Ionicons name="medkit" size={30} color="white" />
      </View>

      {/* Feature Cards */}
      <ScrollView contentContainerStyle={styles.grid}>
        {features.map((feature, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate(feature.screen)}>
            <Image source={feature.icon} style={styles.icon} />
            <Text style={styles.cardText}>{feature.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={30} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Wellness")}>
          <Ionicons name="heart" size={30} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Yoga")}>
          <Ionicons name="medkit" size={30} color="purple" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person" size={30} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const features = [
  { name: "Menstrual Cycle", screen: "Menstrual", icon: require("../assets/menstrual.png") },
  { name: "BMI Calculation", screen: "BMICalculator", icon: require("../assets/bmi.png") },
  { name: "Sleep Tracker", screen: "SleepTracker", icon: require("../assets/Sleep.png") }, // Updated
  { name: "Wellness Management", screen: "Wellness", icon: require("../assets/wellness.png") },
 
   
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6E6FA", marginTop: 20},
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: "purple", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerText: { color: "white", fontSize: 20, fontWeight: "bold" },
  grid: { padding: 30, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "45%", backgroundColor: "white", padding: 20, borderRadius: 15, alignItems: "center", marginBottom: 20, elevation: 5 },
  icon: { width: 50, height: 50, marginBottom: 10 },
  cardText: { fontSize: 16, fontWeight: "bold", color: "purple" },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", padding: 15, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 5 },
});

export default HealthcareScreen;
