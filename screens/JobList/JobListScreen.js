import React, { useState, useEffect  } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { FAB, Card, Text } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {getJobs} from "../../service/api";


const JobListScreen = ({ navigation }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchJobs = async() => {
        try {
            const data = await getJobs();
            setJobs(data.jobs);
            console.log("Jobs fetched:", data.jobs);

        } catch (error) {
            console.log("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    fetchJobs();
  }, []);

    const renderItem = ({ item }) => (
        <Card
            style={styles.card}
            onPress={() => navigation.navigate("JobDetail", { job: item })}
        >
            <Card.Content>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.company}</Text>
                <Text style={styles.salary}>{item.salaryMin} - {item.salaryMax} </Text>
                <View style={styles.row}>
                    <Icon name="map-marker" size={18} color="#0066FF" />
                    <Text style={{ marginLeft: 4 }}>{item.address.city}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="account-group" size={18} color="#0066FF" />
                    <Text style={{ marginLeft: 4 }}>{item.employmentType} ứng viên</Text>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={jobs}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80 }}
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
    container: { flex: 1, backgroundColor: "#F2F6FF", padding: 12 },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: "white",
        elevation: 3,
    },
    title: { fontSize: 18, fontWeight: "600", color: "#333" },
    salary: { color: "#0066FF", fontWeight: "500", marginVertical: 4 },
    row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: "#0066FF",
    },
});

export default JobListScreen;
