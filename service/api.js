import axios from "axios";
import { Platform } from "react-native";

const BASE_HOST = Platform.OS === "android" ? "http://10.0.2.2:80" : "http://192.168.1.52:80";

const api = axios.create({
    baseURL: BASE_HOST + "/api/v1",
    timeout: 5000,
});

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
