import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import SafetyScreen from "../screens/SafetyScreen";
import MaternityScreen from "../screens/MaternityScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HealthcareScreen from "../screens/HealthcareScreen";
import BMICalculatorScreen from "../screens/BMICalculatorScreen";
import BMIResultScreen from "../screens/BMIResultScreen";
import MenstrualTrackerScreen from "../screens/MenstrualTrackerScreen";
import WellnessScreen from "../screens/WellnessScreen";
import YogaMeditationScreen from "../screens/YogaMeditationScreen";
import SignupScreen from "../screens/SignupScreen";  // Import Signup Screen
import AddEmergencyContactScreen from "../screens/AddEmergencyContactScreen";
import SleepTrackerScreen from "../screens/SleepTrackerScreen";
import TestsScreen from "../screens/TestsScreen";


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Healthcare" component={HealthcareScreen} />
      <Stack.Screen name="Safety" component={SafetyScreen} />
      <Stack.Screen name="Maternity" component={MaternityScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="BMICalculator" component={BMICalculatorScreen} />
      <Stack.Screen name="BMIResult" component={BMIResultScreen} />
      <Stack.Screen name="Menstrual" component={MenstrualTrackerScreen} />
      <Stack.Screen name="Wellness" component={WellnessScreen} />
      <Stack.Screen name="Yoga" component={YogaMeditationScreen} />
      <Stack.Screen name="AddEmergencyContact" component={AddEmergencyContactScreen} />
      <Stack.Screen name="SleepTracker" component={SleepTrackerScreen} />
      <Stack.Screen name="TestsScreen" component={TestsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;