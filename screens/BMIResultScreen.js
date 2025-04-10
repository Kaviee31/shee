import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
 
const BMIResultScreen = ({ route, navigation }) => {
  const { bmi, category, suggestion, weight, height } = route.params;
 
  return (
    <ImageBackground source={require('../assets/pillow.png')} style={styles.background}>
      <View style={styles.overlay} />
 
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={32} color="#fff" />
      </TouchableOpacity>
 
      <View style={styles.container}>
        <Text style={styles.title}>Your BMI is</Text>
        <Text style={styles.bmiValue}>{bmi}</Text>
        <Text style={styles.categoryText}>{category}</Text>
       
        {/* Suggestion Section */}
        <View style={styles.suggestionContainer}>
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </View>
 
        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Weight: {weight} kg</Text>
          <Text style={styles.infoText}>Height: {height} cm</Text>
        </View>
      </View>
    </ImageBackground>
  );
};
 
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 139, 0.6)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  bmiValue: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#ffd700',
  },
  suggestionContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
  },
  suggestionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
 
export default BMIResultScreen;
 
 