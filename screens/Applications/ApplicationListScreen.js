import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';

const ApplicationListScreen = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  // Gộp các application theo candidate
  const groupApplicationsByCandidate = (applications) => {
    const map = {};
    applications.forEach(app => {
      const candidateId = app.candidateId._id;
      if (!map[candidateId]) {
        map[candidateId] = {
          candidate: app.candidateId,
          applications: [app],
        };
      } else {
        map[candidateId].applications.push(app);
      }
    });
    return Object.values(map);
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications/recruiter');
      if (response.data?.status === 'success') {
        const grouped = groupApplicationsByCandidate(response.data.data);
        setApplications(grouped);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const candidate = item.candidate;
    const profile = candidate.profile || {};
    const account = candidate.accountId || {};
    const address = profile.address || {};
    const jobList = item.applications.map(app => app.jobId);

    console.log('Rendering candidate:', candidate);
    console.log('Job list, applications:', jobList);
    const getStatusStyle = (status) => {
      switch (status) {
        case 'submitted':
          return { color: '#007bff', fontWeight: 'bold' }; // xanh dương
        case 'accept':
          return { color: '#4caf50', fontWeight: 'bold' }; // xanh lá
        case 'rejected':
          return { color: '#d0021b', fontWeight: 'bold' }; // đỏ
        default:
          return { color: '#000', fontWeight: 'bold' }; // mặc định
      }
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ApplicationDetail', { candidate, jobList })}
      >
        <View style={styles.avatarBox}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <Image source={require('../../assets/default-avatar.png')} style={styles.avatar} />
          )}
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.name}>{account.fullName}</Text>
          <Text style={styles.email}>{account.email}</Text>
          <Text style={styles.location}>
            📍 {address.city || 'Không rõ'}, {address.country || ''}
          </Text>
          <Text style={styles.status}>
            Trạng thái: <Text style={[styles.statusValue, getStatusStyle(item.applications[0].status)]}>{item.applications[0].status}</Text>
          </Text>
          <Text style={styles.appliedCount}>
            Số job đã ứng tuyển: {item.applications.length}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#337ab7" />
        <Text>Đang tải danh sách ứng viên...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity onPress={fetchApplications} style={styles.retryBtn}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (applications.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Chưa có ứng viên nào apply vào job này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.bannerWrapper}>
        <EmployerBanner />
      </View>

      {/* FlatList với ListHeaderComponent để tạo khoảng cách banner */}
      <FlatList
        data={applications}
        keyExtractor={(item) => item.candidate._id}
        renderItem={renderItem}
        ListHeaderComponent={<View style={{ height: 70 }} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ApplicationListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fc',
    paddingHorizontal: 12,
    paddingTop: 0,
  },
  bannerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
    paddingTop: 8,
  },
  avatarBox: {
    marginRight: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e0e0',
  },
  infoBox: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  email: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: '#337ab7',
  },
  location: {
    fontSize: 13,
    color: '#666',
  },
  status: {
    fontSize: 13,
    marginTop: 4,
  },
  statusValue: {
    textTransform: 'capitalize', // giữ như bạn đang dùng
  },
  appliedCount: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryBtn: {
    marginTop: 10,
    backgroundColor: '#337ab7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
