import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";

const BASE_HOST = "http://192.168.1.175:80";

const api = axios.create({
    baseURL: BASE_HOST + "/api/v1",
    timeout: 60000,
});

// Set Authorization header for subsequent requests
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Initialize auth by reading token from AsyncStorage (if any)
export const initAuth = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) setAuthToken(token);
        return token;
    } catch (error) {
        console.error('Error reading token from storage', error);
        return null;
    }
};

// Lấy danh sách jobs
export const getJobs = async () => {
    try {
        const response = await api.get("/jobs"); // endpoint jobs
        console.log("API Response:", response);
        return response;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
};

export default api;
