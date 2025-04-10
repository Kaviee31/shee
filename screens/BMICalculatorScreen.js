import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
 
const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
 
  const calculateBMI = () => {
    if (!weight || !height || isNaN(weight) || isNaN(height)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for weight and height.');
      return;
    }
 
    const heightInMeters = parseFloat(height) / 100;
    const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);
 
    let categoryText = '';
    let suggestionText = '';
 
    if (bmiValue < 18.5) {
      categoryText = 'Underweight';
      suggestionText = 'You should consider a balanced diet with more proteins and healthy fats. Consult a nutritionist.';
    } else if (bmiValue < 24.9) {
      categoryText = 'Normal weight';
      suggestionText = 'Great job! Maintain your current lifestyle with a balanced diet and regular exercise.';
    } else if (bmiValue < 29.9) {
      categoryText = 'Overweight';
      suggestionText = 'Try incorporating more physical activity and a healthy diet into your routine. Small changes can make a big difference!';
    } else {
      categoryText = 'Obese';
      suggestionText = 'Consider a structured weight loss plan with professional guidance. A combination of exercise and diet will help!';
    }
 
    setCategory(categoryText);
    setSuggestion(suggestionText);
 
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
 
    // Pop-up alert with suggestion
    Alert.alert(categoryText, suggestionText);
  };
 
  return (
    <LinearGradient colors={['#ff9a9e', '#fad0c4']} style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>
      <LottieView
        source={require('../assets/bmi.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter Weight (kg)'
        keyboardType='numeric'
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter Height (cm)'
        keyboardType='numeric'
        value={height}
        onChangeText={setHeight}
      />
      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
      {bmi && (
        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
          <Text style={styles.resultText}>Your BMI: {bmi}</Text>
          <Text style={styles.categoryText}>{category}</Text>
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
};
 
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'black', marginBottom: 20 },
  input: { width: '80%', height: 50, backgroundColor: '#fff', padding: 10, marginBottom: 15, borderRadius: 10, textAlign: 'center', fontSize: 18 },
  button: { width: '80%', height: 50, backgroundColor: '#ff6b6b', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultContainer: { marginTop: 20, padding: 15, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, alignItems: 'center' },
  resultText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  categoryText: { fontSize: 20, fontWeight: '600', color: '#ff6b6b' },
  suggestionText: { fontSize: 16, fontWeight: '500', color: '#333', textAlign: 'center', marginTop: 10 },
  animation: { width: 200, height: 200 },
});
 
export default BMICalculator;