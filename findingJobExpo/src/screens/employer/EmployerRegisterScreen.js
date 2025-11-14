import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { colors, radius, spacing } from '../../constants/theme';
import { registerRecruiter } from '../../services/employer';

export default function EmployerRegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !companyName || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      setLoading(true);

      const res = await registerRecruiter({
        fullName,
        email: email.trim(),
        password,
        companyName,
      });

      const status = res?.status;
      const message = res?.message;

      if (status && status !== 'success') {
        Alert.alert('Lỗi', message || 'Đăng ký thất bại.');
        return;
      }

      Alert.alert(
        'Thành công',
        'Đăng ký nhà tuyển dụng thành công. Vui lòng đăng nhập lại.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      console.log('REGISTER ERROR >>>', err?.response?.data || err.message);

      Alert.alert(
        'Lỗi',
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Không thể đăng ký. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đăng ký nhà tuyển dụng</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Thông tin nhà tuyển dụng</Text>

          <Text style={styles.label}>Họ tên người đại diện *</Text>
          <TextInput
            style={styles.input}
            placeholder="VD: Nguyễn Văn A"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Tên công ty *</Text>
          <TextInput
            style={styles.input}
            placeholder="VD: Công ty ABC"
            value={companyName}
            onChangeText={setCompanyName}
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Mật khẩu *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Xác nhận mật khẩu *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <PrimaryButton
            title={loading ? 'Đang đăng ký...' : 'Đăng ký'}
            onPress={handleRegister}
          />

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerText}>
              Đã có tài khoản?{' '}
              <Text style={styles.footerLink}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 12,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundSoft,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 25,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.lg,
    color: '#111827',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: spacing.sm,
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: 14,
  },
  footerText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
    color: '#4B5563',
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
