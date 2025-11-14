// pages/candidates/LoginPage.js
import * as React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { candidateLogin } from "../../service/candidate/authService";
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const { login, isLoggedIn } = React.useContext(AuthContext);

  const handleBack = React.useCallback(() => {
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate("Jobs");
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleRegister = React.useCallback(() => {
    navigation.navigate("Register");
  }, [navigation]);

  const onSubmit = async () => {
    try {
      if (!email.trim() || !password) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập email và mật khẩu.");
        return;
      }
      setLoading(true);

      const { token, user } = await candidateLogin({
        email: email.trim(),
        password,
      });

      if (!token) throw new Error("Không nhận được token");

      await login({ token, user: user || null });

      Alert.alert("✅ Thành công", "Đăng nhập thành công!");
    } catch (e) {
      console.error("Đăng nhập thất bại:", e?.response?.data || e?.message);
      Alert.alert("❌ Đăng nhập thất bại", "Sai thông tin hoặc lỗi máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // Khi login thành công -> chuyển sang Profile
  React.useEffect(() => {
    if (!isLoggedIn) return;

    const timeout = setTimeout(() => {
      try {
        navigation.navigate("Profile");
      } catch (e) {
        console.warn("⚠️ navigate lỗi:", e.message);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [isLoggedIn, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.blueContainer}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Nút quay lại */}
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#2563EB"
              />
              <Text style={styles.backText}>Quay lại danh sách việc</Text>
            </TouchableOpacity>

            {/* Thẻ login */}
            <View style={styles.card}>
              <Text style={styles.title}>Ứng viên</Text>
              <Text style={styles.subtitle}>
                Đăng nhập để quản lý hồ sơ & ứng tuyển
              </Text>

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.inputField}
                  />
                </View>
              </View>

              {/* Mật khẩu */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={styles.inputField}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nút đăng nhập */}
              <TouchableOpacity
                onPress={onSubmit}
                disabled={loading}
                activeOpacity={0.8}
                style={[
                  styles.primaryButton,
                  loading && { backgroundColor: "#93C5FD" },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Đăng nhập</Text>
                )}
              </TouchableOpacity>

              {/* Footer đăng ký */}
              <Text style={styles.footerText}>
                Chưa có tài khoản?{" "}
                <Text style={styles.footerLink} onPress={handleRegister}>
                  Đăng ký ngay
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  blueContainer: {
    flex: 1,
    backgroundColor: "#E5F0FF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    marginLeft: 6,
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 4,
    fontWeight: "600",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    paddingVertical: 8,
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  footerText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
  },
  footerLink: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
