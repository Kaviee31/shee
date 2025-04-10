import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA90M-tbcWN2rw4aFQW3efr07jRXm3fFvE",
  authDomain: "allaboutshe-8a1bb.firebaseapp.com",
  projectId: "allaboutshe-8a1bb",
  storageBucket: "allaboutshe-8a1bb.appspot.com",
  messagingSenderId: "693683634370",
  appId: "1:693683634370:android:25f3141f0d1fe440ccbb5b",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fix: Ensure `auth` is initialized only once
const auth = getAuth(app) ?? initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth, db };
