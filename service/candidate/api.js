import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Device from "expo-device";

const LOCAL_IP = "192.168.1.88"; 

const isAndroidEmulator = Platform.OS === "android" && !Device.isDevice;

export const BASE_HOST = isAndroidEmulator
  ? "http://10.0.2.2:80"          
  : `http://${LOCAL_IP}:80`;       

export const api = axios.create({
  baseURL: BASE_HOST + "/api/v1",
  timeout: 15000,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

api.interceptors.request.use(
  async (config) => {
    if (!config.headers.Authorization) {
      const saved = await AsyncStorage.getItem("@auth");
      if (saved) {
        const { token } = JSON.parse(saved);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);
