import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';

const AddEditJobScreen = ({ navigation }) => {

  const cityOptionsFromAPI = ['Ho Chi Minh City', 'Ha Noi', 'Da Nang', 'Can Tho'];
  const countryOptionsFromAPI = ['Vietnam', 'USA', 'Singapore', 'Japan'];

  const [title, setTitle] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [skills, setSkills] = useState('');
  const [jobExpertise, setJobExpertise] = useState('');
  const [jobDomain, setJobDomain] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [addressCity, setAddressCity] = useState(null);
  const [cityOptions, setCityOptions] = useState(
    cityOptionsFromAPI.map(city => ({ label: city, value: city }))
  );
  const [countryOpen, setCountryOpen] = useState(false);
  const [addressCountry, setAddressCountry] = useState(null);
  const [countryOptions, setCountryOptions] = useState(
    countryOptionsFromAPI.map(country => ({ label: country, value: country }))
  );



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

  const renderLabel = (label, mandatory = false) => (
    <Text style={styles.fieldLabel}>{label}{mandatory && <Text style={{ color: 'red' }}> *</Text>}</Text>
  );

  return (
    <View style={styles.container}>
      <EmployerBanner />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // điều chỉnh tùy header
      >
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>Tạo công việc mới</Text>

          {/* Job Info */}
          {renderLabel('Tiêu đề công việc', true)}
          <TextInput style={styles.input} placeholder="Nhập tiêu đề" value={title} onChangeText={setTitle} />

          {renderLabel('Vị trí công việc', true)}
          <TextInput style={styles.input} placeholder="Nhập vị trí" value={jobTitle} onChangeText={setJobTitle} />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              {renderLabel('Lương tối thiểu', true)}
              <TextInput style={styles.input} placeholder="USD" value={salaryMin} onChangeText={setSalaryMin} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              {renderLabel('Lương tối đa', true)}
              <TextInput style={styles.input} placeholder="USD" value={salaryMax} onChangeText={setSalaryMax} keyboardType="numeric" />
            </View>
          </View>

          {/* Address */}
          {renderLabel('Địa chỉ (số, đường)', true)}
          <TextInput style={styles.input} placeholder="Nhập địa chỉ" value={addressLine} onChangeText={setAddressLine} />

          <View style={{ zIndex: 2000 }}>
            <DropDownPicker
            listMode="SCROLLVIEW"
            nestedScrollEnabled={true}
            open={cityOpen}
            value={addressCity}
            items={cityOptions}
            setOpen={setCityOpen}
            setValue={setAddressCity}
            setItems={setCityOptions}
            placeholder="Chọn thành phố"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          </View>
          <View style={{ zIndex: 1000 }}>
            <DropDownPicker
            listMode="SCROLLVIEW"
            nestedScrollEnabled={true}
            open={countryOpen}
            value={addressCountry}
            items={countryOptions}
            setOpen={setCountryOpen}
            setValue={setAddressCountry}
            setItems={setCountryOptions}
            placeholder="Chọn quốc gia"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          </View>
          

          {renderLabel('Loại hình công việc')}
          <TextInput style={styles.input} placeholder="Full-time, Part-time..." value={employmentType} onChangeText={setEmploymentType} />

          {renderLabel('Kỹ năng')}
          <TextInput style={styles.input} placeholder="Cách nhau bằng dấu phẩy" value={skills} onChangeText={setSkills} />

          {renderLabel('Chuyên môn')}
          <TextInput style={styles.input} placeholder="Cách nhau bằng dấu phẩy" value={jobExpertise} onChangeText={setJobExpertise} />

          {renderLabel('Lĩnh vực')}
          <TextInput style={styles.input} placeholder="Cách nhau bằng dấu phẩy" value={jobDomain} onChangeText={setJobDomain} />

          {renderLabel('Mô tả công việc', true)}
          <TextInput style={[styles.input, { height: 100 }]} placeholder="Nhập mô tả chi tiết" value={description} onChangeText={setDescription} multiline />

          <LinearGradient colors={['#4caf50', '#66bb6a']} style={styles.submitBtn}>
            <TouchableOpacity onPress={handleSubmit} disabled={loading}>
              <Text style={styles.submitBtnText}>{loading ? 'Đang tạo...' : 'Tạo công việc'}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 20, paddingTop: 64 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#337ab7', marginBottom: 16 },
  fieldLabel: { fontWeight: 'bold', fontSize: 14, color: '#333', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  pickerContainer: { flex: 1, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 14, justifyContent: 'center', marginHorizontal: 4 },
  picker: { width: '100%', height: 44 },
  submitBtn: { marginTop: 10, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 30 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 5,
    height: 45,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
});

export default AddEditJobScreen;
