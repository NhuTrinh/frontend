import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { colors, spacing, radius } from "../../constants/theme";
import { loginRecruiter } from "../../services/employer";

// GOOGLE + FACEBOOK
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { loginWithSocial } from "../../services/oauth";

import appConfig from "../../../app.json";

WebBrowser.maybeCompleteAuthSession();

export default function EmployerLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // GOOGLE AUTH
  const [googleReq, googleRes, googlePrompt] = Google.useAuthRequest({
    clientId: appConfig.expo.extra.googleClientId,
  });

  // FACEBOOK AUTH
  const [fbReq, fbRes, fbPrompt] = Facebook.useAuthRequest({
    clientId: appConfig.expo.extra.facebookAppId,
  });

  // -----------------------
  // LOGIN BẰNG EMAIL
  // -----------------------
  const handleLogin = async () => {
    try {
      const res = await loginRecruiter(email, password);

      if (!res.token) {
        Alert.alert("Lỗi", "Email hoặc mật khẩu không đúng");
        return;
      }

      navigation.replace("EmployerDashboard", {
        token: res.token,
      });
    } catch (err) {
      Alert.alert("Lỗi", "Không thể đăng nhập.");
    }
  };

  // -----------------------
  // LOGIN GOOGLE
  // -----------------------
  const handleGoogleLogin = async () => {
    try {
      const result = await googlePrompt();

      if (result?.type === "success") {
        const accessToken = result.authentication.accessToken;

        // Lấy info user từ Google
        const userInfo = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => res.json());

        const login = await loginWithSocial(userInfo.email, userInfo.name);

        navigation.replace("EmployerDashboard", {
          token: login.token ?? login.raw?.token,
        });
      }
    } catch (err) {
      console.log("GOOGLE LOGIN ERROR >>>", err);
    }
  };

  // -----------------------
  // LOGIN FACEBOOK
  // -----------------------
  const handleFacebookLogin = async () => {
    try {
      const fb = await fbPrompt();

      if (fb?.type === "success") {
        const accessToken = fb.authentication.accessToken;

        // lấy info user
        const user = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
        ).then((res) => res.json());

        const login = await loginWithSocial(user.email, user.name);

        navigation.replace("EmployerDashboard", {
          token: login.token ?? login.raw?.token,
        });
      }
    } catch (err) {
      console.log("FACEBOOK LOGIN ERROR >>>", err);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đăng nhập nhà tuyển dụng</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
        />

        <PrimaryButton title="Đăng nhập" onPress={handleLogin} />

        {/* SOCIAL BUTTONS */}
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: "#DB4437" }]} onPress={handleGoogleLogin}>
          <Text style={styles.socialText}>Đăng nhập bằng Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: "#1877F2" }]} onPress={handleFacebookLogin}>
          <Text style={styles.socialText}>Đăng nhập bằng Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("EmployerRegister")}>
          <Text style={styles.footerText}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  container: { padding: spacing.lg },
  label: { fontSize: 14, marginBottom: 5 },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: radius.md,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  socialBtn: {
    padding: 12,
    borderRadius: radius.md,
    marginTop: 10,
  },
  socialText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    marginTop: 15,
    color: colors.primary,
  },
});
