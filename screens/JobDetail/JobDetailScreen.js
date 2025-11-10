import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const JobDetailScreen = ({ route, navigation }) => {
    const { job } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{job.title}</Text>
                    <Text style={styles.company}>{job.company}</Text>

                    <View style={styles.infoRow}>
                        <Icon name="cash" size={20} color="#0066FF" />
                        <Text style={styles.infoText}>{job.salary}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="map-marker" size={20} color="#0066FF" />
                        <Text style={styles.infoText}>{job.city}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="account-group" size={20} color="#0066FF" />
                        <Text style={styles.infoText}>{job.candidates} ứng viên</Text>
                    </View>

                    <View style={styles.actions}>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('AddEditJob', { job })}
                            style={styles.editButton}
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => {
                                // Xử lý xóa job
                                navigation.goBack();
                            }}
                            style={styles.deleteButton}
                            textColor="red"
                        >
                            Xóa
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F6FF',
        padding: 12,
    },
    card: {
        borderRadius: 12,
        backgroundColor: 'white',
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    company: {
        fontSize: 18,
        color: '#666',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#444',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 24,
    },
    editButton: {
        flex: 1,
        marginRight: 8,
        backgroundColor: '#0066FF',
    },
    deleteButton: {
        flex: 1,
        marginLeft: 8,
        borderColor: 'red',
    },
});

export default JobDetailScreen;