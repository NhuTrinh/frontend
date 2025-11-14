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

export default function EmployerCandidatesScreen({ route }) {
  const token = route.params?.token;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadApplications = async (isRefresh = false) => {
    if (!token) return;

    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await getRecruiterApplications(token);

      // data có thể là { items: [...] } hoặc [...] tuỳ backend
      const list = Array.isArray(data) ? data : data?.items || [];
      setApplications(list);
    } catch (err) {
      console.log('LOAD APPLICATIONS ERROR >>>', err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApplications(false);
  }, [token]);

  const onRefresh = () => {
    loadApplications(true);
  };

  const renderStatus = (statusRaw) => {
    const status = (statusRaw || '').toString().toLowerCase();

    if (status.includes('accept')) return 'Đã chấp nhận';
    if (status.includes('reject') || status.includes('denied')) return 'Đã từ chối';
    if (status.includes('pending') || !status) return 'Đang chờ xử lý';

    return statusRaw;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải danh sách ứng viên...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View className="header" style={styles.header}>
        <Text style={styles.logo}>ITViec</Text>
        <View>
          <Text style={styles.headerTitle}>Ứng viên đã ứng tuyển</Text>
          <Text style={styles.headerSubtitle}>
            Danh sách ứng viên nộp đơn vào job của bạn
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
        {applications.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có ứng viên nào ứng tuyển.</Text>
        ) : (
          applications.map((item, index) => {
            const key = item.id || item._id || index.toString();

            const candidateName =
              item.candidateName ||
              item.fullName ||
              item.name ||
              (item.candidate && (item.candidate.fullName || item.candidate.name)) ||
              'Ứng viên';

            const email =
              item.email ||
              (item.candidate && item.candidate.email) ||
              'Không có email';

            const jobTitle =
              item.jobTitle ||
              (item.job && item.job.title) ||
              'Vị trí chưa xác định';

            const status = renderStatus(item.status);

            const appliedAt =
              item.appliedAt ||
              item.createdAt ||
              (item.meta && item.meta.createdAt) ||
              null;

            return (
              <Card key={key} style={styles.card}>
                <Text style={styles.candidateName}>{candidateName}</Text>
                <Text style={styles.jobTitle}>{jobTitle}</Text>

                <Text style={styles.line}>Email: {email}</Text>

                {appliedAt && (
                  <Text style={styles.line}>Ngày ứng tuyển: {appliedAt}</Text>
                )}

                <Text style={styles.status}>
                  Trạng thái: <Text style={styles.statusValue}>{status}</Text>
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
  candidateName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
  },
  line: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  status: {
    marginTop: 6,
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  statusValue: {
    fontWeight: '700',
    color: colors.primary,
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
