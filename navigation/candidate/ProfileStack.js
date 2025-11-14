// navigation/ProfileStack.js
import * as React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* 🔥 Import đúng từ screens → Candidates */
import ProfileScreen from "../../screens/Candidates/ProfileScreen";

const Stack = createNativeStackNavigator();

/* Helper tránh crash nếu import sai */
const ensure = (name, Comp) =>
  Comp ||
  (() => (
    <Text style={{ padding: 20, color: "red" }}>{name} is undefined</Text>
  ));

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ensure("ProfileScreen", ProfileScreen)}
        options={{
          title: "Hồ sơ",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}
