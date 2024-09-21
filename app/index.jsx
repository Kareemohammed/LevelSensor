import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../firebase";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const [notificationSent, setNotificationSent] = useState(false);

  const auth = getAuth(app);
  const db = getDatabase(app);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log("Redirecting to HomeScreen");
        router.push("/screens/HomeScreen");
      }
    };

    checkAuth();
    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    try {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          console.log("Failed to get push token for push notifications!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Push token:", token);
      } else {
        // alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    } catch (error) {
      console.error("Error registering for notifications:", error);
    }
  }

  useEffect(() => {
    const sensorRef = ref(db, "sensor/distance");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();

      // Check if the distance exceeds 15 mm and notification has not been sent
      if (data > 15 && !notificationSent) {
        console.log("Triggering notification, distance:", data);
        triggerNotification();
        setNotificationSent(true); // Ensure notification is only sent once
      } else if (data <= 15) {
        // Reset notificationSent flag when distance is back below threshold
        setNotificationSent(false);
      }
    });

    return () => unsubscribe();
  }, [notificationSent]);

  const triggerNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Alert!",
          body: "The distance has crossed 15 mm.",
          sound: true,
        },
        trigger: null, // Immediate trigger
      });
      console.log("Notification scheduled successfully");
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  return (
    <LinearGradient colors={["#141e30", "#243b55"]} style={styles.container}>
      <View style={styles.content}>
        <Animatable.View
          animation="fadeInDown"
          delay={500}
          style={styles.iconContainer}
        >
          <Ionicons name="hardware-chip" size={80} color="#fff" />
        </Animatable.View>
        <Animatable.Text
          animation="fadeInUp"
          duration={1500}
          delay={800}
          style={styles.title}
        >
          Welcome to Level Sensor
        </Animatable.Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screens/LoginScreen")}
        >
          <Animatable.Text
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            style={styles.buttonText}
          >
            Get Started
          </Animatable.Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4b2b",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 10,
  },
});
