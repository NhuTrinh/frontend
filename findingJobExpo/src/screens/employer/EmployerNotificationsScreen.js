import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, spacing } from '../../constants/theme';
import Card from '../../components/ui/Card';
import { getRecruiterApplications } from '../../services/employer';

export default function EmployerNotificationsScreen({ route }) {
  const token = route.params?.token;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async (isRefresh = false) => {
    if (!token) return;

    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await getRecruiterApplications(token);
      const list = Array.isArray(data) ? data : data?.items || [];

      // Lọc những đơn pending coi như "chưa xử lý" = thông báo
      const pending = list.filter((item) => {
        const status = (item.status || '').toString().toLowerCase();
        return !status || status.includes('pending');
      });

      // Sort mới nhất lên trên (nếu có createdAt)
      pending.sort((a, b) => {
        const aTime = new Date(a.createdAt || a.appliedAt || 0).getTime();
        const bTime = new Date(b.createdAt || b.appliedAt || 0).getTime();
        return bTime - aTime;
      });

      setNotifications(pending);
    } catch (err) {
      console.log('LOAD NOTIFICATIONS ERROR >>>', err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications(false);
  }, [token]);

  const onRefresh = () => {
    loadNotifications(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải thông báo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>ITViec</Text>
        <View>
          <Text style={styles.headerTitle}>Thông báo tuyển dụng</Text>
          <Text style={styles.headerSubtitle}>
            Nhận thông tin khi có ứng viên mới ứng tuyển
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>
            Hiện chưa có thông báo mới. Khi có ứng viên nộp đơn, thông báo sẽ hiển thị tại đây.
          </Text>
        ) : (
          notifications.map((item, index) => {
            const key = item.id || item._id || index.toString();

            const candidateName =
              item.candidateName ||
              item.fullName ||
              (item.candidate && (item.candidate.fullName || item.candidate.name)) ||
              'Ứng viên';

            const jobTitle =
              item.jobTitle ||
              (item.job && item.job.title) ||
              'Vị trí chưa xác định';

            const createdAt =
              item.createdAt ||
              item.appliedAt ||
              (item.meta && item.meta.createdAt) ||
              null;

            return (
              <Card key={key} style={styles.card}>
                <Text style={styles.title}>
                  Ứng viên mới: {candidateName}
                </Text>
                <Text style={styles.line}>Ứng tuyển vào: {jobTitle}</Text>
                {createdAt && (
                  <Text style={styles.line}>Thời gian: {createdAt}</Text>
                )}
                <Text style={styles.hint}>
                  Mở màn “Ứng viên đã ứng tuyển” để xem chi tiết và xử lý hồ sơ.
                </Text>
              </Card>
            );
          })
        )}
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
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  line: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 16,
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
