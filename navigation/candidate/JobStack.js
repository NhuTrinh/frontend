import * as React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* 🔥 Import đúng từ screens/Candidates */
import JobListScreen from "../../screens/Candidates/JobListScreen";
import JobDetailScreen from "../../screens/Candidates/JobdetailScreen"; 
// lưu ý: file của bạn trong hình là JobdetailScreen.js (d nhỏ).
// Nếu file bạn đặt là JobDetailScreen.js thì sửa path lại cho trùng tên.

const Stack = createNativeStackNavigator();
const ensure = (name, Comp) =>
  Comp ||
  (() => (
    <Text style={{ padding: 20, color: "red" }}>{name} is undefined</Text>
  ));

export default function JobStack() {
  console.log("check job screens", {
    JobListScreen: !!JobListScreen,
    JobDetailScreen: !!JobDetailScreen,
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JobList"
        component={ensure("JobListScreen", JobListScreen)}
        options={{ title: "Công việc" }}
      />
      <Stack.Screen
        name="JobDetail"
        component={ensure("JobDetailScreen", JobDetailScreen)}
        options={{ title: "Chi tiết công việc" }}
      />
    </Stack.Navigator>
  );
}
