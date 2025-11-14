import axios from 'axios';
import { Platform } from "react-native";


const BASE_HOST =
  Platform.OS === "android" ? "http://10.0.2.2:80" : "http://localhost:80";

export const api = axios.create({
  baseURL: BASE_HOST + "/api/v1",
  timeout: 15000,
});
