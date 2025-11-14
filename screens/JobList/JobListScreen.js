import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import api from "../../service/api";
import EmployerBanner from "../../components/EmployerBanner";
import Modal from 'react-native-modal';

const JobListScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
const [selectedJobId, setSelectedJobId] = useState(null);

  const fetchApplications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/applications/recruiter', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Chưa đăng nhập");

      const response = await api.get("/jobs/recruiter", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(response.data.data || []);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  const countApplicationsForJob = (jobId) => {
    return applications.filter(app => app.jobId._id === jobId).length;
  };

  const handleConfirmDelete = (jobId) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa công việc này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await api.delete(`/jobs/${jobId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(jobs.filter((job) => job._id !== jobId));
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa công việc");
          }
        },
      },
    ]);
  };

  const showDeleteModal = (jobId) => {
  setSelectedJobId(jobId);
  setDeleteModalVisible(true);
};

const hideDeleteModal = () => {
  setDeleteModalVisible(false);
  setSelectedJobId(null);
};

  const renderItem = ({ item }) => (
    <Card style={[styles.card, item.isHot && styles.cardHot]} onPress={() => navigation.navigate("JobDetail", { job: item })}>
      <Card.Content>
        <View style={styles.row}>
          <Image
            source={{ uri: item.companyLogo || "https://itviec.com/favicon.ico" }}
            style={styles.logo}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.company}><Icon name="office-building" size={14} color="#337ab7" /> {item.companyName || "UIT"}</Text>
            <Text style={styles.salary}><Icon name="cash" size={14} color="#009900" /> {item.salaryMin} - {item.salaryMax} USD</Text>
            <Text style={styles.locationText}><Icon name="map-marker" size={14} color="#0066FF" /> {item.address.city}</Text>
          </View>
          {item.isHot && (
            <View style={styles.ribbon}>
              <Text style={styles.ribbonText}>HOT</Text>
            </View>
          )}
        </View>

        <View style={styles.skillRow}>
          {(item.skills || []).map((skill, idx) => (
            <View key={idx} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        <View style={styles.applicantRow}>
          <Icon name="account-group" size={16} color="#fff" />
          <Text style={styles.applicantText}>{countApplicationsForJob(item._id)} ứng viên</Text>
        </View>
      </Card.Content>

      <Card.Actions style={{ justifyContent: "flex-end", marginTop: 6 }}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("ApplicationByJob", { jobId: item._id })}>
          <Icon name="account-group" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#337ab7" }]} onPress={() => navigation.navigate("EditJob", { jobId: item._id })}>
          <Icon name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
       <TouchableOpacity
  style={[styles.actionBtn, { backgroundColor: "#d0021b" }]}
  onPress={() => showDeleteModal(item._id)}
>
  <Icon name="delete" size={20} color="#fff" />
</TouchableOpacity>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bannerWrapper}>
        <EmployerBanner />
        <LinearGradient
          colors={['#4caf50', '#66bb6a']}
          start={[0, 0]} end={[1, 0]}
          style={styles.createButton}
        >
          <TouchableOpacity onPress={() => navigation.navigate("AddEditJob")}>
            <Text style={styles.createButtonText}>Tạo Job mới</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 130 }}
      />
      <Modal
        isVisible={deleteModalVisible}
        onBackdropPress={hideDeleteModal}
        backdropOpacity={0.4}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Xác nhận xóa</Text>
          <Text style={{ marginVertical: 10, textAlign: 'center' }}>
            Bạn có chắc muốn xóa công việc này?
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity
              onPress={hideDeleteModal}
              style={{ flex: 1, marginRight: 5, padding: 12, backgroundColor: '#ccc', borderRadius: 8, alignItems: 'center' }}
            >
              <Text>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirmDelete}
              style={{ flex: 1, marginLeft: 5, padding: 12, backgroundColor: '#d0021b', borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff' }}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
  bannerWrapper: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  createButton: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 12,
    paddingTop: 8,
  },
  cardHot: { borderColor: "#d0021b", borderWidth: 1, backgroundColor: "#fff7f7" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  logo: { width: 44, height: 44, borderRadius: 8, marginRight: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#b3d1ff" },
  title: { fontSize: 17, fontWeight: "bold", color: "#333" },
  company: { fontSize: 14, color: "#009688", fontWeight: "500", marginTop: 2 },
  salary: { color: "#009900", fontWeight: "bold", marginVertical: 6, fontSize: 16 },
  locationText: { color: "#0066FF", marginTop: 2 },
  ribbon: { position: 'absolute', top: 10, right: -10, backgroundColor: '#d0021b', paddingVertical: 2, paddingHorizontal: 10, transform: [{ rotate: '45deg' }] },
  ribbonText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  skillRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  skillTag: { backgroundColor: "#e6f2ff", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6, marginBottom: 4 },
  skillText: { color: "#337ab7", fontSize: 12, fontWeight: "500" },
  applicantRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#337ab7', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  applicantText: { color: '#fff', marginLeft: 4, fontSize: 12, fontWeight: 'bold' },
  actionBtn: { backgroundColor: 'green', padding: 6, borderRadius: 8, marginLeft: 6 },
});

export default JobListScreen;
