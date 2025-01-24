import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getDatabase, ref, onValue } from "firebase/database";
import * as Animatable from "react-native-animatable";
import Svg, { Circle, Line, Rect } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Notifications from "expo-notifications";

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get("window");

const MAX_VALUE = 3000; // Maximum value for the container
const NOTIFICATION_THRESHOLD = 15;

export default function SensorDataScreen() {
  const [distance, setDistance] = useState(0);
  const [notificationSent, setNotificationSent] = useState(false);
  const [initialCheck, setInitialCheck] = useState(false); // To handle initial notification

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Please enable notifications in your settings");
    }
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alert!",
        body: `The level has crossed ${NOTIFICATION_THRESHOLD} mm.`,
      },
      trigger: null, // Trigger immediately
    });
  };

  useEffect(() => {
    requestNotificationPermissions();

    const db = getDatabase();
    const sensorRef = ref(db, "sensor/distance");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      setDistance(data || 0);

      // Send initial notification if the initial value is above the threshold
      if (!initialCheck && data > NOTIFICATION_THRESHOLD) {
        scheduleNotification();
        setInitialCheck(true); // Prevents multiple initial notifications
      }

      // Send notification when value crosses above the threshold
      if (data > NOTIFICATION_THRESHOLD && !notificationSent) {
        scheduleNotification();
        setNotificationSent(true);
      } else if (data <= NOTIFICATION_THRESHOLD) {
        setNotificationSent(false);
      }
    });

    // Handle incoming notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Listen to notifications while the app is in the background or closed
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received: ", notification);
      }
    );

    return () => {
      unsubscribe();
      subscription.remove(); // Clean up the listener
    };
  }, [notificationSent, initialCheck]);

  const fillPercentage = Math.min((distance / MAX_VALUE) * 100, 100);

  return (
    <LinearGradient colors={["#141e30", "#243b55"]} style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1500} style={styles.header}>
        <Ionicons name="analytics-outline" size={50} color="#ff416c" />
        <Text style={styles.title}>Container Level</Text>
        <Text style={styles.subtitle}>Real-time Monitoring</Text>
      </Animatable.View>

      <View style={styles.content}>
        <Animatable.View
          animation="bounceIn"
          duration={2000}
          style={styles.dataContainer}
        >
          <MaterialCommunityIcons name="speedometer" size={40} color="#fff" />
          <Text style={styles.dataValue}>
            {distance !== null ? `${distance} mm` : "Loading..."}
          </Text>
        </Animatable.View>

        <View style={styles.containerWrapper}>
          <Svg height="250" width="250" viewBox="0 0 100 100">
            <Rect
              x="10"
              y="10"
              width="80"
              height="80"
              fill="none"
              stroke="#00BFFF"
              strokeWidth="4"
            />
            <Rect
              x="10"
              y={10 + 80 * (1 - fillPercentage / 100)}
              width="80"
              height={80 * (fillPercentage / 100)}
              fill="rgba(0, 191, 255, 0.5)"
            />
            <Line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="#ff416c"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </Svg>
        </View>
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
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ff416c",
    paddingBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginTop: 10,
    textAlign: "center",
  },
  content: {
    width: width * 0.9,
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  dataContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff416c",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },
  dataValue: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  containerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
  },
});
