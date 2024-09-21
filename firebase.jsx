import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDE2ClzRnz1XmNJJgYRw2eUH2aFLPlX6VE",
  authDomain: "level-sensor-cb682.firebaseapp.com",
  databaseURL:
    "https://level-sensor-cb682-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "level-sensor-cb682",
  storageBucket: "level-sensor-cb682.appspot.com",
  messagingSenderId: "776137290694",
  appId: "1:776137290694:web:c969e00144c515ca07f8c7",
  measurementId: "G-GL649PYJCC",
};


// Initialize Firebase app only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Realtime Database
const db = getDatabase(app);

export { auth, db };