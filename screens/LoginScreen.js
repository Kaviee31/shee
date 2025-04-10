import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, Animated } from 'react-native';
import { auth } from "../firebaseConfig";  // Import from your Firebase config
import { signInWithEmailAndPassword } from "firebase/auth";




const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setError('⚠️ Please enter a valid email address.');
      triggerShake();
      return;
    }
    if (!validatePassword(password)) {
      setError('🔒 Password should have at least 6 characters.');
      triggerShake();
      return;
    }
    setError('');
    

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Alert.alert('✅ Success', `Welcome ${user.email}!`);
    navigation.navigate('Home'); // Navigate to Home Screen after successful login
  })
  .catch((error) => {
    if (error.code === 'auth/user-not-found') {
      setError('⚠️ No user found with this email.');
    } else if (error.code === 'auth/wrong-password') {
      setError('🚨 Incorrect password. Try again!');
    } else {
      //setError(`❌ ${error.message}`);
      setError('Invalid username/password');
    }
    triggerShake(); // Shake animation for incorrect login attempt
  });
  };

  return (
    <ImageBackground source={require('../assets/login2.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>All about She</Text>
        {error ? (
          <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        ) : null}
        <TextInput 
          style={styles.input} 
          placeholder="📧 Email" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.input} 
          placeholder="🔑 Password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>🚀 Login</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp") }>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword") }>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  input: { width: '80%', height: 50, backgroundColor: '#fff', padding: 10, marginBottom: 15, borderRadius: 10 },
  button: { width: '80%', height: 50, backgroundColor: '#ff6b6b', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: {
    color: '#ff3b3b',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 15,
    width: '80%',
  },
  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  link: {
    color: "black",
    fontSize: 14,
    fontWeight:"bold",
    width: "100%",
    padding: 12,
    backgroundColor: "skyblue",
    borderRadius: 8,
    
  },
});

export default LoginScreen;
