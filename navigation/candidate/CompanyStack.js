import * as React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* 🔥 Import đúng từ screens/Candidates */
import CompanyScreen from "../../screens/Candidates/CompanyScreen";
import CompanyDetailScreen from "../../screens/Candidates/CompanyDetailScreen";

const Stack = createNativeStackNavigator();

/* tránh crash nếu import sai */
const ensure = (name, Comp) =>
  Comp ||
  (() => (
    <Text style={{ padding: 20, color: "red" }}>{name} is undefined</Text>
  ));

export default function CompanyStack() {
  console.log("check company screens", {
    CompanyScreen: !!CompanyScreen,
    CompanyDetailScreen: !!CompanyDetailScreen,
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CompanyList"
        component={ensure("CompanyScreen", CompanyScreen)}
        options={{ title: "Công ty" }}
      />
      <Stack.Screen
        name="CompanyDetail"
        component={ensure("CompanyDetailScreen", CompanyDetailScreen)}
        options={{ title: "Chi tiết công ty" }}
      />
    </Stack.Navigator>
  );
}
