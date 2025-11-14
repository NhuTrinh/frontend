import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Card from '../../components/ui/Card';
import { colors, spacing } from '../../constants/theme';

export default function EmployerDashboardScreen({ navigation, route }) {
  const token = route.params?.token;

  // Tạm fake số liệu; bước B sẽ lấy từ backend
  const stats = {
    newCandidates: 3,
    unreadNotifications: 2,
    profileCompletion: 80,
  };

  const handleLogout = () => {
    // Sau này sẽ clear token ở AsyncStorage nữa
    navigation.reset({
      index: 0,
      routes: [{ name: 'EmployerLogin' }],
    });
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>ITViec</Text>
          <View>
            <Text style={styles.headerTitle}>Bảng điều khiển</Text>
            <Text style={styles.headerSubtitle}>
              Quản lý tuyển dụng cho nhà tuyển dụng
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* NỘI DUNG */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hồ sơ công ty */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Text style={styles.iconText}>C</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Hồ sơ công ty</Text>
              <Text style={styles.cardText}>
                Cập nhật logo, mô tả, địa chỉ, website, quy mô nhân sự...
              </Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricLabel}>Hoàn thiện</Text>
              <Text style={styles.metricValue}>{stats.profileCompletion}%</Text>
            </View>
          </View>

          <PrimaryButton
            title="Quản lý thông tin công ty"
            onPress={() =>
              navigation.navigate('EmployerCompanyInfo', { token })
            }
          />
        </Card>

        {/* Ứng viên đã ứng tuyển */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#E5E7EB' }]}>
              <Text style={styles.iconText}>A</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Ứng viên đã ứng tuyển</Text>
              <Text style={styles.cardText}>
                Xem danh sách và chi tiết ứng viên ứng tuyển vào các job của bạn.
              </Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricLabel}>Mới</Text>
              <Text style={styles.metricValue}>{stats.newCandidates}</Text>
            </View>
          </View>

          <PrimaryButton
            title="Xem danh sách ứng viên"
            onPress={() =>
              navigation.navigate('EmployerCandidates', { token })
            }
          />
        </Card>

        {/* Thông báo tuyển dụng */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDE68A' }]}>
              <Text style={styles.iconText}>N</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Thông báo tuyển dụng</Text>
              <Text style={styles.cardText}>
                Nhận thông báo khi có ứng viên mới hoặc update trạng thái hồ sơ.
              </Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricLabel}>Chưa đọc</Text>
              <Text style={styles.metricValue}>
                {stats.unreadNotifications}
              </Text>
            </View>
          </View>

          <PrimaryButton
            title="Xem thông báo"
            onPress={() =>
              navigation.navigate('EmployerNotifications', { token })
            }
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundSoft,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  logoutBtn: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  logoutText: {
    fontSize: 12,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 32,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  cardText: {
    fontSize: 13,
    color: '#4B5563',
  },
  metricChip: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
  },
});
