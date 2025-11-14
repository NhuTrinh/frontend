// navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import JobListScreen from "../screens/JobList/JobListScreen";
import JobDetailScreen from "../screens/JobDetail/JobDetailScreen";
import AddEditJobScreen from "../screens/AddEditJob/AddEditJobScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import EditJobScreen from "../screens/AddEditJob/EditJobScreen";
import CompanyDetailScreen from "../screens/Company/CompanyDetailScreen";
import EditCompanyScreen from "../screens/Company/EditCompanyScreen";

import MainTabs from "./candidate/MainTabs";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="CandidateTabs"   
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="CandidateTabs"
        component={MainTabs}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Đăng nhập", headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Trang chủ", headerShown: false }}
      />
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
      <Stack.Screen
        name="EditJob"
        component={EditJobScreen}
        options={{ title: "Thêm/Sửa công việc" }}
      />
      <Stack.Screen
        name="CompanyDetail"
        component={CompanyDetailScreen}
        options={{ title: "Thông tin công ty" }}
      />
      <Stack.Screen
        name="EditCompany"
        component={EditCompanyScreen}
        options={{ title: "Sửa thông tin công ty" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
