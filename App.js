import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // ✅ Configure Notification Behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // ✅ Register Device for Push Notifications
    const registerForPushNotifications = async () => {
      if (!Device.isDevice) {
        console.warn("⚠️ Must use a physical device for push notifications");
        return;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('❌ Notification permission not granted.');
        return;
      }

      console.log("✅ Notification permission granted");

      try {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log("🔑 Expo Push Token:", token.data);
      } catch (error) {
        console.error("❌ Error getting push token:", error);
      }
    };

    registerForPushNotifications();

    // ✅ Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("🔔 Notification Received: ", notification);
    });

    // ✅ Listen for notification interaction
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("📩 Notification Clicked: ", response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // ✅ Helper Function to Schedule a Notification
  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Sleep 😴",
        body: "Make sure to get enough rest!",
        sound: "default",  // ✅ Corrected
      },
      trigger: { seconds: 60 }, // Triggers after 1 minute
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
