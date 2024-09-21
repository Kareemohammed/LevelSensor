import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from 'react-native-vector-icons';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  return (
    <LinearGradient colors={['#0a0a0a', '#2b2b2b']} style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1500} style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Monitor and manage your hardware</Text>
      </Animatable.View>

      {user && (
        <Animatable.View animation="fadeInDown" duration={1500} style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Welcome, {user.displayName || 'User'}!</Text>
          {/* <Text style={styles.userInfoText}>{user.email}</Text> */}
        </Animatable.View>
      )}

      <View style={styles.content}>
        <Animatable.View animation="fadeInUp" duration={1500} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/screens/StatusScreen')}
          >
            <Ionicons name="analytics-outline" size={30} color="#fff" />
            <Text style={styles.buttonText}>Real-time Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/screens/DeviceStatus')}
          >
             <Ionicons name="hardware-chip" size={30} color="#fff" />
            <Text style={styles.buttonText}>Device</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/screens/SettingsScreen')}

          >
            <Ionicons name="settings-outline" size={30} color="#fff" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ff416c',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginTop: 10,
    textAlign: 'center',
  },
  userInfoContainer: {
    marginBottom: 30,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: width * 0.9,
  },
  userInfoText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 5,
  },
  content: {
    width: width * 0.9,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#ff416c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});
