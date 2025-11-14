// pages/candidates/RegisterPage.js
import * as React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { candidateRegister } from "../../service/candidate/authService";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleBack = React.useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  const handleGoLogin = React.useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  const onSubmit = async () => {
    try {
      if (!email.trim() || !password || !confirmPassword) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường.");
        return;
      }

      if (password.length < 6) {
        Alert.alert("Mật khẩu quá ngắn", "Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Mật khẩu không khớp", "Vui lòng nhập lại mật khẩu.");
        return;
      }

      setLoading(true);

      await candidateRegister({
        email: email.trim(),
        password,
      });

      Alert.alert("🎉 Đăng ký thành công", "Bạn hãy đăng nhập để tiếp tục.", [
        { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
        { text: "Đóng" },
      ]);
    } catch (e) {
      console.error("Đăng ký thất bại:", e?.response?.data || e?.message);
      Alert.alert(
        "❌ Đăng ký thất bại",
        "Có thể email đã tồn tại hoặc lỗi máy chủ."
      );
    } finally {
      setLoading(false);
    }
  };

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
              <Text style={styles.backText}>Quay lại đăng nhập</Text>
            </TouchableOpacity>

            {/* Card đăng ký */}
            <View style={styles.card}>
              <Text style={styles.title}>Đăng ký ứng viên</Text>
              <Text style={styles.subtitle}>
                Tạo tài khoản để quản lý hồ sơ & ứng tuyển
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

              {/* Nhập lại mật khẩu */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nhập lại mật khẩu</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    style={styles.inputField}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((v) => !v)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name={
                        showConfirmPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nút đăng ký */}
              <TouchableOpacity
                onPress={onSubmit}
                disabled={loading}
                activeOpacity={0.8}
                style={[
                  styles.primaryButton,
                  loading && { backgroundColor: "#93C5FD" },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </Text>
              </TouchableOpacity>

              {/* Footer: đã có tài khoản */}
              <Text style={styles.footerText}>
                Đã có tài khoản?{" "}
                <Text style={styles.footerLink} onPress={handleGoLogin}>
                  Đăng nhập
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
    paddingTop: 40, // đẩy card xuống thêm cho cân đối
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
