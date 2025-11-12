import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';
import { Picker } from '@react-native-picker/picker';

const AddEditJobScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressCountry, setAddressCountry] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [skills, setSkills] = useState('');
  const [jobExpertise, setJobExpertise] = useState('');
  const [jobDomain, setJobDomain] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const cityOptions = ['Ho Chi Minh City', 'Ha Noi', 'Da Nang', 'Can Tho'];
  const countryOptions = ['Vietnam', 'USA', 'Singapore', 'Japan'];

  const handleSubmit = async () => {
    if (!title || !jobTitle || !salaryMin || !salaryMax || !addressLine || !addressCity || !addressCountry || !description) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const body = {
        title,
        jobTitle,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        address: {
          line: addressLine,
          city: addressCity,
          country: addressCountry,
        },
        employmentType,
        skills: skills.split(',').map(s => s.trim()),
        jobExpertise: jobExpertise.split(',').map(s => s.trim()),
        jobDomain: jobDomain.split(',').map(s => s.trim()),
        description,
      };
      await api.post('/jobs', body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Tạo job thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', error?.response?.data?.message || 'Không thể tạo job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <EmployerBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tạo công việc mới</Text>
        <TextInput style={styles.input} placeholder="Tiêu đề" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Vị trí công việc" value={jobTitle} onChangeText={setJobTitle} />
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.half]} placeholder="Lương tối thiểu" value={salaryMin} onChangeText={setSalaryMin} keyboardType="numeric" />
          <TextInput style={[styles.input, styles.half]} placeholder="Lương tối đa" value={salaryMax} onChangeText={setSalaryMax} keyboardType="numeric" />
        </View>
        <TextInput style={styles.input} placeholder="Địa chỉ (số, đường)" value={addressLine} onChangeText={setAddressLine} />
        <View style={styles.row}>
          <View style={[styles.pickerContainer, { paddingHorizontal: 0, width: '49%' }]}> 
            <Picker
              selectedValue={addressCity}
              onValueChange={setAddressCity}
              style={[styles.picker, { minWidth: 120 }]}
              itemStyle={{ fontSize: 15 }}
            >
              <Picker.Item label="Chọn thành phố" value="" />
              {cityOptions.map(city => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
          <View style={[styles.pickerContainer, { paddingHorizontal: 0, width: '49%' }]}> 
            <Picker
              selectedValue={addressCountry}
              onValueChange={setAddressCountry}
              style={[styles.picker, { minWidth: 120 }]}
              itemStyle={{ fontSize: 15 }}
            >
              <Picker.Item label="Chọn quốc gia" value="" />
              {countryOptions.map(country => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
          </View>
        </View>
        <TextInput style={styles.input} placeholder="Loại hình (Full-time, Part-time...)" value={employmentType} onChangeText={setEmploymentType} />
        <TextInput style={styles.input} placeholder="Kỹ năng (cách nhau bằng dấu phẩy)" value={skills} onChangeText={setSkills} />
        <TextInput style={styles.input} placeholder="Chuyên môn (cách nhau bằng dấu phẩy)" value={jobExpertise} onChangeText={setJobExpertise} />
        <TextInput style={styles.input} placeholder="Lĩnh vực (cách nhau bằng dấu phẩy)" value={jobDomain} onChangeText={setJobDomain} />
        <TextInput style={[styles.input, { height: 80 }]} placeholder="Mô tả công việc" value={description} onChangeText={setDescription} multiline />
        <Button title={loading ? 'Đang tạo...' : 'Tạo công việc'} onPress={handleSubmit} disabled={loading} color="#337ab7" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 20, paddingTop: 64 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#337ab7', marginBottom: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    justifyContent: 'center',
    minWidth: 120,
  },
  picker: {
    width: '100%',
    minWidth: 120,
    height: 44,
    color: '#333',
    fontSize: 15,
    paddingHorizontal: 0,
  },
});

export default AddEditJobScreen;