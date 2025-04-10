import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const YogaMeditationScreen = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleBreathing = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={30} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Yoga & Meditation</Text>
        <Ionicons name="leaf" size={30} color="white" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Breathing Exercise */}
        <View style={styles.section}>
          <Text style={styles.title}>Breathing Exercise</Text>
          <TouchableOpacity style={styles.breathingButton} onPress={toggleBreathing}>
            <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={60} color="purple" />
            <Text style={styles.breathingText}>{isPlaying ? "Pause" : "Start"} Breathing</Text>
          </TouchableOpacity>
        </View>

        {/* Meditation */}
        <View style={styles.section}>
          <Text style={styles.title}>Guided Meditation</Text>
          <TouchableOpacity style={styles.meditationCard}>
            <Image source={require("../assets/meditation.png")} style={styles.icon} />
            <Text style={styles.cardText}>10-min Mindfulness</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.meditationCard}>
            <Image source={require("../assets/meditation.png")} style={styles.icon} />
            <Text style={styles.cardText}>Sleep Relaxation</Text>
          </TouchableOpacity>
        </View>

        {/* Yoga Poses */}
        <View style={styles.section}>
          <Text style={styles.title}>Yoga Poses</Text>
          <TouchableOpacity style={styles.meditationCard}>
            <Image source={require("../assets/yoga.png")} style={styles.icon} />
            <Text style={styles.cardText}>Beginner Yoga</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.meditationCard}>
            <Image source={require("../assets/yoga.png")} style={styles.icon} />
            <Text style={styles.cardText}>Advanced Yoga</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6E6FA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: "purple", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 20 },
  headerText: { color: "white", fontSize: 20, fontWeight: "bold" },
  content: { padding: 20 },
  section: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", color: "purple", marginBottom: 10 },
  breathingButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "white", borderRadius: 15, elevation: 5 },
  breathingText: { fontSize: 16, fontWeight: "bold", marginLeft: 10, color: "purple" },
  meditationCard: { flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 15, borderRadius: 15, marginBottom: 10, elevation: 5 },
  icon: { width: 40, height: 40, marginRight: 10 },
  cardText: { fontSize: 16, fontWeight: "bold", color: "purple" },
});

export default YogaMeditationScreen;
