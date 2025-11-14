import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import JobListScreen from "../screens/JobList/JobListScreen";
import JobDetailScreen from "../screens/JobDetail/JobDetailScreen";
import AddEditJobScreen from "../screens/AddEditJob/AddEditJobScreen";
import LoginScreen from '../screens/Login/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import EditJobScreen from '../screens/AddEditJob/EditJobScreen';
import CompanyDetailScreen from '../screens/Company/CompanyDetailScreen';
import EditCompanyScreen from '../screens/Company/EditCompanyScreen';
import ApplicationListScreen from '../screens/Applications/ApplicationListScreen';
import ApplicationDetailScreen from '../screens/Applications/ApplicationDetailScreen';
import ApplicationByJobScreen from '../screens/Applications/ApplicationByJobScreen';
import RecruiterInformationDetailScreen from '../screens/Recruiters/RecruiterInformationDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Đăng nhập", headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Trang chủ", headerShown: false }}s
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
            <Stack.Screen
                name="ApplicationList"
                component={ApplicationListScreen}
                options={{ title: 'Ứng viên đã ứng tuyển' }}
            />
            <Stack.Screen
                name="ApplicationByJob"
                component={ApplicationByJobScreen}
                options={{ title: 'Ứng viên theo công việc' }}
            />
            <Stack.Screen
                name="ApplicationDetail"
                component={ApplicationDetailScreen}
                options={{ title: 'Chi tiết ứng viên' }}
            />
            <Stack.Screen
                name="RecruiterInformationDetail"
                component={RecruiterInformationDetailScreen}
                options={{ title: 'Thông tin nhà tuyển dụng' }}
            />
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
