import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';
import { Picker } from '@react-native-picker/picker';

const cityOptions = ['Ho Chi Minh City', 'Ha Noi', 'Da Nang', 'Can Tho'];
const countryOptions = ['Vietnam', 'USA', 'Singapore', 'Japan'];

const EditJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    jobTitle: '',
    salaryMin: '',
    salaryMax: '',
    addressLine: '',
    addressCity: '',
    addressCountry: '',
    employmentType: 'Full-time',
    skills: '',
    jobExpertise: '',
    jobDomain: '',
    description: '',
  });

  useEffect(() => {
    fetchJobDetail();
  }, []);

  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const job = response.data;
      setForm({
        title: job.title || '',
        jobTitle: job.jobTitle || '',
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        addressLine: job.address?.line || '',
        addressCity: job.address?.city || '',
        addressCountry: job.address?.country || '',
        employmentType: job.employmentType || 'Full-time',
        skills: (job.skills || []).join(', '),
        jobExpertise: (job.jobExpertise || []).join(', '),
        jobDomain: (job.jobDomain || []).join(', '),
        description: job.description || '',
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.jobTitle || !form.salaryMin || !form.salaryMax || !form.addressLine || !form.addressCity || !form.addressCountry || !form.description) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const body = {
        title: form.title,
        jobTitle: form.jobTitle,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        address: {
          line: form.addressLine,
          city: form.addressCity,
          country: form.addressCountry,
        },
        employmentType: form.employmentType,
        skills: form.skills.split(',').map(s => s.trim()),
        jobExpertise: form.jobExpertise.split(',').map(s => s.trim()),
        jobDomain: form.jobDomain.split(',').map(s => s.trim()),
        description: form.description,
      };
      await api.put(`/jobs/${jobId}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Cập nhật job thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', error?.response?.data?.message || 'Không thể cập nhật job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <EmployerBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sửa công việc</Text>
        <TextInput style={styles.input} placeholder="Tiêu đề" value={form.title} onChangeText={v => handleChange('title', v)} />
        <TextInput style={styles.input} placeholder="Vị trí công việc" value={form.jobTitle} onChangeText={v => handleChange('jobTitle', v)} />
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.half]} placeholder="Lương tối thiểu" value={form.salaryMin} onChangeText={v => handleChange('salaryMin', v)} keyboardType="numeric" />
          <TextInput style={[styles.input, styles.half]} placeholder="Lương tối đa" value={form.salaryMax} onChangeText={v => handleChange('salaryMax', v)} keyboardType="numeric" />
        </View>
        <TextInput style={styles.input} placeholder="Địa chỉ (số, đường)" value={form.addressLine} onChangeText={v => handleChange('addressLine', v)} />
        <View style={styles.row}>
          <View style={styles.pickerContainer}> 
            <Picker
              selectedValue={form.addressCity}
              onValueChange={v => handleChange('addressCity', v)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn thành phố" value="" />
              {cityOptions.map(city => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}> 
            <Picker
              selectedValue={form.addressCountry}
              onValueChange={v => handleChange('addressCountry', v)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn quốc gia" value="" />
              {countryOptions.map(country => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
          </View>
        </View>
        <TextInput style={styles.input} placeholder="Loại hình (Full-time, Part-time...)" value={form.employmentType} onChangeText={v => handleChange('employmentType', v)} />
        <TextInput style={styles.input} placeholder="Kỹ năng (cách nhau bằng dấu phẩy)" value={form.skills} onChangeText={v => handleChange('skills', v)} />
        <TextInput style={styles.input} placeholder="Chuyên môn (cách nhau bằng dấu phẩy)" value={form.jobExpertise} onChangeText={v => handleChange('jobExpertise', v)} />
        <TextInput style={styles.input} placeholder="Lĩnh vực (cách nhau bằng dấu phẩy)" value={form.jobDomain} onChangeText={v => handleChange('jobDomain', v)} />
        <TextInput style={[styles.input, { height: 80 }]} placeholder="Mô tả công việc" value={form.description} onChangeText={v => handleChange('description', v)} multiline />
        <Button title={loading ? 'Đang cập nhật...' : 'Cập nhật công việc'} onPress={handleSubmit} disabled={loading} color="#337ab7" />
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
    width: '48%',
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

export default EditJobScreen;
