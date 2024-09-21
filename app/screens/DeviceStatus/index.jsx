import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function ESP32DetailsScreen() {
  const [rotateY] = useState(new Animated.Value(0));
  const [lastRotateY, setLastRotateY] = useState(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: rotateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === 5) { // 5 corresponds to the end of the gesture
      setLastRotateY(lastRotateY + event.nativeEvent.translationX);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#2b2b2b']} style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            ESP32 Microcontroller
          </Text>
          <Text style={styles.subtitle}>
            Powering the Future of IoT
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Specs</Text>
              <Text style={styles.cardText}>- Dual-core Processor</Text>
              <Text style={styles.cardText}>- Wi-Fi & Bluetooth</Text>
              <Text style={styles.cardText}>- GPIO Pins: 34</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Key Features</Text>
              <Text style={styles.cardText}>- 240 MHz Clock</Text>
              <Text style={styles.cardText}>- 520 KB SRAM</Text>
              <Text style={styles.cardText}>- 18 ADC Channels</Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <Animated.Image
                source={require('../../../assets/images/esp32.png')}
                style={[
                  styles.esp32Image,
                  {
                    transform: [
                      { rotateY: rotateY.interpolate({
                          inputRange: [-width, width],
                          outputRange: ['-360deg', '360deg'],
                        })
                      },
                    ],
                  },
                ]}
              />
            </PanGestureHandler>
          </View>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    marginTop: 49,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#D9E4F5',
    marginTop: 10,
    fontStyle: 'italic',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
  },
  card: {
    width: width * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#F1F1F1',
    marginBottom: 5,
  },
  imageContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  esp32Image: {
    width: width * 0.7,
    height: height * 0.35,
    resizeMode: 'contain',
  },
});
