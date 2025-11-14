import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import api from '../../service/api';

const RecruiterInformationDetailScreen = ({ route, navigation }) => {
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecruiter = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recruiters/profile');
      if (response.data?.status === 'success') {
        setRecruiter(response.data);
      } else {
        setError('Không lấy được thông tin nhà tuyển dụng');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi khi fetch thông tin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiter();
  }, []);

  const handleEmailPress = () => {
    if (recruiter?.email) {
      Linking.openURL(`mailto:${recruiter.email}`);
    }
  };

  const handleCallPress = () => {
    if (recruiter?.phone) {
      Linking.openURL(`tel:${recruiter.phone}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#337ab7" />
        <Text>Đang tải thông tin nhà tuyển dụng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity onPress={fetchRecruiter} style={styles.retryBtn}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fake avatar & phone if not exist
  const avatarUrl = recruiter?.avatar || 'https://i.pravatar.cc/150?img=12';
  const phone = recruiter?.phone || '0123 456 789';
  const position = recruiter?.position || 'Recruiter';
  const company = recruiter?.recruiter?.companyId || 'Không có dữ liệu';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>{recruiter.fullName}</Text>
        <Text style={styles.position}>{position}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{recruiter.email}</Text>
        <TouchableOpacity style={styles.contactBtn} onPress={handleEmailPress}>
          <Text style={styles.contactText}>Gửi Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Điện thoại:</Text>
        <Text style={styles.value}>{phone}</Text>
        <TouchableOpacity style={styles.contactBtn} onPress={handleCallPress}>
          <Text style={styles.contactText}>Gọi ngay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RecruiterInformationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fc',
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
  header: {
    backgroundColor: '#337ab7',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  position: {
    fontSize: 16,
    color: '#d1e0ff',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  contactBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  contactText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
