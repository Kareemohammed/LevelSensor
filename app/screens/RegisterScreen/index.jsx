import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { app } from '../../../firebase'; // Ensure this path is correct

const auth = getAuth(app);

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Ensure that Email/Password sign-in method is enabled in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile with the display name
      await updateProfile(userCredential.user, { displayName: name });

      Alert.alert("Registration Successful", `Welcome, ${name}!`);
      router.push("/screens/LoginScreen");
    } catch (error) {
      const errorCode = error.code;
      let errorMessage = "An unknown error occurred.";

      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already in use.";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is invalid.";
          break;
        case 'auth/weak-password':
          errorMessage = "The password is too weak.";
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert("Registration Error", errorMessage);
    }
  };

  return (
    <LinearGradient colors={['#141e30', '#243b55']} style={styles.container}>
      <Animatable.View animation="fadeInUp" delay={500} style={styles.form}>
        <View style={styles.header}>
          <Ionicons name="hardware-chip" size={60} color="#fff" />
          <Text style={styles.headerText}>Register at Level Sensor</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Name" 
            placeholderTextColor="#ccc" 
            style={styles.input} 
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Email" 
            placeholderTextColor="#ccc" 
            style={styles.input} 
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Password" 
            placeholderTextColor="#ccc" 
            secureTextEntry={!showPassword} 
            style={styles.input} 
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
          <Ionicons name="person-add-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/screens/LoginScreen")} style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 50,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff416c',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
});
