import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const AddEditJobScreen = ({ route, navigation }) => {
    const job = route.params?.job; // Nếu có job được truyền vào thì là edit mode

    const [title, setTitle] = useState(job?.title || '');
    const [company, setCompany] = useState(job?.company || '');
    const [salary, setSalary] = useState(job?.salary || '');
    const [city, setCity] = useState(job?.city || '');
    const [candidates, setCandidates] = useState(job?.candidates?.toString() || '0');

    const handleSubmit = () => {
        const jobData = {
            id: job?.id || Date.now().toString(),
            title,
            company,
            salary,
            city,
            candidates: parseInt(candidates),
        };

        // TODO: Xử lý lưu dữ liệu
        console.log('Job data:', jobData);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <TextInput
                label="Tiêu đề công việc"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Tên công ty"
                value={company}
                onChangeText={setCompany}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Mức lương"
                value={salary}
                onChangeText={setSalary}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Thành phố"
                value={city}
                onChangeText={setCity}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Số lượng ứng viên"
                value={candidates}
                onChangeText={setCandidates}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
            />

            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
            >
                {job ? 'Cập nhật' : 'Thêm mới'}
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F6FF',
        padding: 16,
    },
    input: {
        backgroundColor: 'white',
        marginBottom: 12,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#0066FF',
        paddingVertical: 6,
    },
});

export default AddEditJobScreen;