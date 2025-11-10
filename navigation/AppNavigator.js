import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import JobListScreen from "../screens/JobList/JobListScreen";
import JobDetailScreen from "../screens/JobDetail/JobDetailScreen";
import AddEditJobScreen from "../screens/AddEditJob/AddEditJobScreen";

const Stack = createStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="JobList"
                component={JobListScreen}
                options={{ title: "Danh sách công việc" }}
            />
            <Stack.Screen
                name="JobDetail"
                component={JobDetailScreen}
                options={{ title: "Chi tiết công việc" }}
            />
            <Stack.Screen
                name="AddEditJob"
                component={AddEditJobScreen}
                options={{ title: "Thêm/Sửa công việc" }}
            />
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
