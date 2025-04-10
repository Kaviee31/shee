// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground source={require('../assets/splash.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>✨ Welcome to All About She ✨</Text>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
});

export default SplashScreen;
