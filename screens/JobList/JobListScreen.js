import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Image } from "react-native";
import { FAB, Card, Text } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../service/api';
import { Alert } from "react-native";
import EmployerBanner from '../../components/EmployerBanner';

const JobListScreen = ({ navigation }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Chưa đăng nhập');
            const response = await api.get('/jobs/recruiter', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(response.data.data || []);
            console.log('Jobs fetched:', response.data.data);
        } catch (error) {
            console.log('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDeleteJob = async (jobId) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc muốn xóa công việc này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await api.delete(`/jobs/${jobId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            setJobs(jobs.filter(job => job._id !== jobId));
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa công việc');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Card
            style={[styles.card, item.isHot ? styles.cardHot : styles.cardNormal]}
            onPress={() => navigation.navigate("JobDetail", { job: item })}
        >
            <Card.Content>
                <View style={styles.row}>
                    <Image
                        source={{ uri: item.companyLogo || 'https://itviec.com/favicon.ico' }}
                        style={styles.logo}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.title}</Text>
                        {item.isHot && (
                            <View style={styles.hotBadge}><Text style={styles.hotText}>SUPER HOT</Text></View>
                        )}
                        <Text style={styles.company}>{item.companyName || 'Tên công ty'}</Text>
                    </View>
                </View>
                <Text style={styles.salary}>{item.salaryMin} - {item.salaryMax} USD</Text>
                <View style={styles.row}>
                    <Text style={styles.type}>{item.employmentType}</Text>
                    <Icon name="map-marker" size={18} color="#0066FF" style={{ marginLeft: 8 }} />
                    <Text style={{ marginLeft: 4 }}>{item.address.city}</Text>
                </View>
                <View style={styles.skillRow}>
                    {(item.skills || []).map((skill, idx) => (
                        <View key={idx} style={styles.skillTag}><Text style={styles.skillText}>{skill}</Text></View>
                    ))}
                </View>
            </Card.Content>
            <Card.Actions>
                <FAB
                    small
                    icon="pencil"
                    style={styles.editFab}
                    color="#fff"
                    onPress={() => navigation.navigate('EditJob', { jobId: item._id })}
                />
                <FAB
                    small
                    icon="delete"
                    style={styles.deleteFab}
                    color="#fff"
                    onPress={() => handleDeleteJob(item._id)}
                />
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.bannerWrapper}>
                <EmployerBanner />
            </View>
            <FlatList
                data={jobs}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80, paddingTop: 56 }}
                showsVerticalScrollIndicator={false}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                color="white"
                onPress={() => navigation.navigate("AddEditJob")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f6f7fb" },
    bannerWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    card: {
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 0,
        marginHorizontal: 12,
        paddingTop: 8,
    },
    cardHot: {
        backgroundColor: '#fff7f7',
        borderColor: '#d0021b',
        borderWidth: 1,
    },
    cardNormal: {
        backgroundColor: '#fff',
    },
    logo: {
        width: 44,
        height: 44,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#b3d1ff',
    },
    title: { fontSize: 17, fontWeight: "bold", color: "#333" },
    hotBadge: {
        backgroundColor: '#d0021b',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginTop: 4,
        marginBottom: 2,
    },
    hotText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    company: { fontSize: 14, color: "#009688", fontWeight: "500", marginTop: 2 },
    salary: { color: "#009900", fontWeight: "bold", marginVertical: 6, fontSize: 16 },
    type: { color: '#333', fontSize: 13, fontWeight: '500' },
    row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    skillRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
    skillTag: {
        backgroundColor: '#e6f2ff',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 6,
        marginBottom: 4,
    },
    skillText: {
        color: '#337ab7',
        fontSize: 12,
        fontWeight: '500',
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: "#337ab7",
    },
    deleteFab: {
        backgroundColor: "#d0021b",
        marginLeft: 8,
    },
    editFab: {
        backgroundColor: "#337ab7",
        marginLeft: 0,
        marginRight: 8,
    },
});

export default JobListScreen;
