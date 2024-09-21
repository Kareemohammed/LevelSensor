import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="screens/LoginScreen/index"
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="screens/RegisterScreen/index"
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="screens/HomeScreen/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/StatusScreen/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/DeviceStatus/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/SettingsScreen/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
