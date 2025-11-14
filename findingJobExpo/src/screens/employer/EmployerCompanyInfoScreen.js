import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Card from '../../components/ui/Card';
import { getRecruiterProfile, updateRecruiterProfile } from '../../services/employer';

export default function EmployerCompanyInfoScreen({ route }) {
  const token = route.params?.token;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Recruiter info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Company info (nếu profile có)
  const [companyName, setCompanyName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const loadProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const profile = await getRecruiterProfile(token);

      if (!profile) return;

      setFullName(profile.fullName || '');
      setEmail(profile.email || '');

      const company = profile.company || {};
      setCompanyName(company.name || '');
      const addr = company.address || {};
      setAddressLine(addr.line || '');
      setCity(addr.city || '');
      setCountry(addr.country || '');
    } catch (err) {
      console.log('LOAD RECRUITER PROFILE ERROR >>>', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  const handleSave = async () => {
    if (!fullName || !companyName) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất họ tên và tên công ty.');
      return;
    }

    try {
      setSaving(true);

      const body = {
        fullName,
        email,
        company: {
          name: companyName,
          address: {
            line: addressLine,
            city,
            country,
          },
        },
      };

      await updateRecruiterProfile(token, body);

      Alert.alert('Thành công', 'Cập nhật thông tin thành công.');
    } catch (err) {
      console.log('UPDATE RECRUITER PROFILE ERROR >>>', err?.response?.data || err.message);
      Alert.alert(
        'Lỗi',
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Không thể cập nhật thông tin.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>ITViec</Text>
        <View>
          <Text style={styles.headerTitle}>Thông tin công ty</Text>
          <Text style={styles.headerSubtitle}>
            Cập nhật hồ sơ nhà tuyển dụng và công ty
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin nhà tuyển dụng</Text>

          <Text style={styles.label}>Họ tên</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="VD: Nguyễn Văn A"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={email}
            editable={false}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin công ty</Text>

          <Text style={styles.label}>Tên công ty</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="VD: Công ty ABC"
          />

          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            value={addressLine}
            onChangeText={setAddressLine}
            placeholder="VD: 123 Nguyễn Văn Cừ"
          />

          <Text style={styles.label}>Thành phố</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="VD: TP. Hồ Chí Minh"
          />

          <Text style={styles.label}>Quốc gia</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="VD: Việt Nam"
          />
        </Card>

        <PrimaryButton
          title={saving ? 'Đang lưu...' : 'Lưu thông tin'}
          onPress={handleSave}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundSoft,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 32,
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.md,
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
  inputDisabled: {
    backgroundColor: '#E5E7EB',
    color: '#6B7280',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: colors.textMuted,
  },
});
