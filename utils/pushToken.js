import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";

export async function registerAndSyncPushToken(api, accountId) {
  if (!Device.isDevice) {
    Alert.alert("Thông báo", "Vui lòng chạy trên thiết bị thật để test push notification.");
    return null;
  }

  // Cấu hình channel cho Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Xin quyền hiển thị thông báo
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    Alert.alert("Không được cấp quyền thông báo!");
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId ??
    null;
  if (!projectId) {
    console.warn("❌ Thiếu projectId trong app.json hoặc package.json -> expo.extra.eas.projectId");
    return null;
  }

  try {
    // Lấy token push của Expo
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

    // Lấy deviceId (Android)
    let deviceId = null;
    try {
      if (Platform.OS === "android" && Application.getAndroidId) {
        deviceId = await Application.getAndroidId();
      }
    } catch (e) {
      console.log("getAndroidId error:", e);
    }

    // Gửi token lên backend
    console.log(" Gửi token lên server…");
    const body = {
      token,
      deviceId: deviceId || null,
      platform: Device.osName || "android",
      appVersion: Application.nativeApplicationVersion || null,
    };
    if (accountId) body.accountId = accountId;

    const res = await api.patch("/me/push-token", body);
    console.log("✅ push-token resp =", res?.status, res?.data);

    return token;
  } catch (e) {
    console.error("❌ Lỗi khi sync push token:", e?.response?.data || e?.message);
    return null;
  }
}
