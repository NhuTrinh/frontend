import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";

const ApplicationByJobScreen = ({ route, navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ Modal State
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); // "accept" | "reject"
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const { jobId } = route.params;

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

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = (applications || []).filter(candidateGroup =>
    candidateGroup.applications.some(app => String(app.jobId?._id) === String(jobId))
  );

  // ⭐ Hàm xử lý Accept / Reject
  const handleConfirmAction = async () => {
    if (!selectedApplicationId || !selectedAction) return;

    try {
      if (selectedAction === "accept") {
        await api.patch(`/applications/${selectedApplicationId}/accept`);
      } else {
        await api.patch(`/applications/${selectedApplicationId}/reject`);
      }

      setModalVisible(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const openConfirmModal = (action, appId) => {
    setSelectedAction(action);
    setSelectedApplicationId(appId);
    setModalVisible(true);
  };

 

  const renderItem = ({ item }) => {
    const candidate = item.candidate || {};
    const profile = candidate.profile || {};
    const account = candidate.accountId || {};
    const address = profile.address || {};
    const jobList = item.applications.map(app => app.jobId);
    const currentJobApp = item.applications.find(app => String(app.jobId._id) === String(jobId));

    const currentAppId = currentJobApp?._id;

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
            Trạng thái: <Text style={[styles.statusValue, getStatusStyle(currentJobApp?.status)]}>{currentJobApp?.status}</Text>
          </Text>
          <Text style={styles.appliedCount}>
            Số job đã ứng tuyển: {item.applications.length}
          </Text>

          {/* Nút Accept & Reject mở Modal */}
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => openConfirmModal("accept", currentAppId)}
              style={styles.iconBtn}
            >
              <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openConfirmModal("reject", currentAppId)}
              style={styles.iconBtn}
            >
              <Ionicons name="close-circle" size={30} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ⭐ UI LOADING – ERROR – EMPTY
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

  // =============================
  // ⭐⭐ MODAL XÁC NHẬN ⭐⭐
  // =============================
  const actionText =
    selectedAction === "accept" ? "Chấp nhận ứng viên?" : "Từ chối ứng viên?";

  const actionColor = selectedAction === "accept" ? "#4CAF50" : "#F44336";

  return (
    <View style={styles.container}>

      <View style={styles.bannerWrapper}>
        <EmployerBanner />
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.candidate._id}
        renderItem={renderItem}
        ListHeaderComponent={<View style={{ height: 70 }} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* ⭐ MODAL CUSTOM */}
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.4}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Ionicons
            name={selectedAction === "accept" ? "checkmark-circle" : "close-circle"}
            size={60}
            color={actionColor}
            style={{ marginBottom: 10 }}
          />

          <Text style={styles.modalTitle}>{actionText}</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalConfirm, { backgroundColor: actionColor }]}
              onPress={handleConfirmAction}
            >
              <Text style={styles.modalConfirmText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default ApplicationByJobScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8fc', paddingHorizontal: 12 },
  bannerWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  infoBox: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16 },
  email: { fontSize: 13, color: '#777' },
  jobTitle: { fontSize: 14, color: '#337ab7' },
  location: { fontSize: 13, color: '#666' },
  status: { fontSize: 13, marginTop: 4 },
  statusValue: {
  textTransform: 'capitalize', // giữ như bạn đang dùng
},
  appliedCount: { fontSize: 13, color: '#555', marginTop: 2 },
  iconBtn: {
    marginRight: 16,
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryBtn: { marginTop: 10, backgroundColor: '#337ab7', padding: 10, borderRadius: 6 },
  retryText: { color: '#fff', fontWeight: 'bold' },

  // Modal
  modalContent: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  modalCancelText: { textAlign: 'center', fontWeight: '600' },
  modalConfirm: { flex: 1, padding: 12, borderRadius: 10 },
  modalConfirmText: { color: 'white', textAlign: 'center', fontWeight: '600' },
});
