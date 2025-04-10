import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getRandomChallenge = () => {
  const challenges = [
    "Take 10 deep breaths and relax.",
    "Write down 3 things you're grateful for.",
    "Stretch for 5 minutes.",
    "Drink a glass of water mindfully.",
    "Give yourself a 5-minute break and close your eyes.",
  ];
  return challenges[Math.floor(Math.random() * challenges.length)];
};

const getDailyChallenge = async () => {
  try {
    const storedChallenge = await AsyncStorage.getItem("dailyChallenge");
    const storedDate = await AsyncStorage.getItem("challengeDate");
    const today = new Date().toDateString();

    if (storedChallenge && storedDate === today) {
      return storedChallenge;
    }

    const newChallenge = getRandomChallenge();
    await AsyncStorage.setItem("dailyChallenge", newChallenge);
    await AsyncStorage.setItem("challengeDate", today);

    return newChallenge;
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    return "Take a deep breath and smile!";
  }
};

const WellnessScreen = () => {
  const [sound, setSound] = useState(null);
  const [meditationTime, setMeditationTime] = useState(5 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState("");

  const [waterCount, setWaterCount] = useState(0);
  const [gratitude, setGratitude] = useState("");
  const [stressLevel, setStressLevel] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      const challenge = await getDailyChallenge();
      setDailyChallenge(challenge);
    };
    fetchChallenge();
  }, []);

  const playSound = async () => {
    if (isPlaying) return;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../assets/meditation.mp3"),
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      const newTimer = setInterval(() => {
        setMeditationTime((prev) => {
          if (prev <= 1) {
            stopSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimer(newTimer);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }

    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    setIsPlaying(false);
    setMeditationTime(5 * 60); // Reset to 5 minutes
  };

  const saveGratitude = () => {
    if (!gratitude.trim()) {
      Alert.alert("Write something you're grateful for!");
      return;
    }
    Alert.alert("Saved!", "Gratitude noted 💖");
    setGratitude("");
  };

  const formatTime = (time) =>
    `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, "0")}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Wellness & Relaxation</Text>

      {/* 🌟 Daily Challenge */}
      <View style={styles.challengeCard}>
        <Text style={styles.sectionTitle}>🌟 Daily Challenge</Text>
        <Text style={styles.challengeText}>{dailyChallenge}</Text>
      </View>

      {/* 🧘‍♀️ Meditation Timer */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🧘‍♀️ 5-Minute Meditation</Text>
        <LottieView
          source={require("../assets/breathing.json")}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.timer}>{formatTime(meditationTime)}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, isPlaying && styles.disabledButton]}
            onPress={playSound}
            disabled={isPlaying}
          >
            <Ionicons name="play" size={20} color="white" />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={stopSound}
          >
            <Ionicons name="stop" size={20} color="white" />
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 💧 Hydration Tracker */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💧 Hydration Tracker</Text>
        <Text style={styles.infoText}>Cups Drank Today: {waterCount}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setWaterCount(waterCount + 1)}
        >
          <Ionicons name="water" size={20} color="white" />
          <Text style={styles.buttonText}>Drink Water</Text>
        </TouchableOpacity>
      </View>

      {/* 🙏 Gratitude Journal */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🙏 Gratitude Journal</Text>
        <TextInput
          style={styles.input}
          placeholder="I'm grateful for..."
          value={gratitude}
          onChangeText={setGratitude}
        />
        <TouchableOpacity style={styles.button} onPress={saveGratitude}>
          <Ionicons name="save" size={20} color="white" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* 😌 Stress Tracker */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>😌 Stress Level</Text>
        <Text style={styles.infoText}>How are you feeling today?</Text>
        <View style={styles.stressButtons}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.stressCircle,
                stressLevel === level && styles.stressSelected,
              ]}
              onPress={() => setStressLevel(level)}
            >
              <Text style={styles.stressText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5FF",
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#4B0082",
  },
  card: {
    backgroundColor: "#fff",
    width: "95%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  challengeCard: {
    backgroundColor: "#FFF5EE",
    width: "95%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#FFA500",
  },
  challengeText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
  },
  animation: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  timer: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    marginLeft: 6,
  },
  input: {
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  stressButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stressCircle: {
    backgroundColor: "#eee",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stressSelected: {
    backgroundColor: "#4B0082",
  },
  stressText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default WellnessScreen;
