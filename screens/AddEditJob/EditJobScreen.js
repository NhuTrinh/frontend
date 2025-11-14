import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, StyleSheet, ScrollView, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

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
  // 1. CHECK FORM
  if (
    !form.title ||
    !form.jobTitle ||
    !form.salaryMin ||
    !form.salaryMax ||
    !form.addressLine ||
    !form.addressCity ||
    !form.addressCountry ||
    !form.description
  ) {
    Toast.show({
      type: 'error',
      text1: 'Thiếu thông tin',
      text2: 'Vui lòng nhập đầy đủ tất cả các trường bắt buộc.',
    });
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

    // 2. SUCCESS TOAST
    Toast.show({
      type: 'success',
      text1: 'Cập nhật thành công',
      text2: 'Job đã được cập nhật ✔️',
      position: 'bottom',
    });

    // Delay 400ms để toast hiển thị rồi mới goBack (mượt UX)
    setTimeout(() => {
      navigation.goBack();
    }, 400);

  } catch (error) {
    // 3. ERROR TOAST
    Toast.show({
      type: 'error',
      text1: 'Lỗi cập nhật',
      text2: error?.response?.data?.message || 'Không thể cập nhật job.',
      position: 'bottom',
    });
  } finally {
    setLoading(false);
  }
};

  const renderLabel = (label, mandatory = false) => (
    <Text style={styles.fieldLabel}>{label}{mandatory && <Text style={{ color: 'red' }}> *</Text>}</Text>
  );

  const [openCity, setOpenCity] = useState(false);
  const [valueCity, setValueCity] = useState(form.addressCity);
  const [itemsCity, setItemsCity] = useState(
    cityOptions.map(c => ({ label: c, value: c }))
  );

  // COUNTRY DROPDOWN STATE
  const [openCountry, setOpenCountry] = useState(false);
  const [valueCountry, setValueCountry] = useState(form.addressCountry);
  const [itemsCountry, setItemsCountry] = useState(
    countryOptions.map(c => ({ label: c, value: c }))
  );

  return (
    <View style={styles.container}>
      <View style={styles.bannerWrapper}>
        <EmployerBanner />

        <LinearGradient
          colors={['#4caf50', '#66bb6a']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.createButton}
        >
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.createButtonText}>Cập nhật công việc</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // điều chỉnh tùy header
            >
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Cập nhật công việc</Text>
        {renderLabel('Tiêu đề công việc', true)}
        <TextInput style={styles.input} placeholder="Tiêu đề" value={form.title} onChangeText={v => handleChange('title', v)} />

        {renderLabel('Vị trí công việc', true)}
        <TextInput style={styles.input} placeholder="Vị trí công việc" value={form.jobTitle} onChangeText={v => handleChange('jobTitle', v)} />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 6 }}>
            {renderLabel('Lương tối thiểu', true)}
            <TextInput style={[styles.input, styles.half]} placeholder="Lương tối thiểu" value={form.salaryMin} onChangeText={v => handleChange('salaryMin', v)} keyboardType="numeric" />
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          {renderLabel('Lương tối đa', true)}
          <TextInput style={[styles.input, styles.half]} placeholder="Lương tối đa" value={form.salaryMax} onChangeText={v => handleChange('salaryMax', v)} keyboardType="numeric" />
        </View>

        {renderLabel('Địa chỉ (số, đường)', true)}
        <TextInput style={styles.input} placeholder="Địa chỉ (số, đường)" value={form.addressLine} onChangeText={v => handleChange('addressLine', v)} />


        {/* CITY DROPDOWN */}
        <View style={[styles.dropdownWrapper, { zIndex: 2000 }]}>
          <DropDownPicker
            listMode="SCROLLVIEW"
            nestedScrollEnabled={true}
            open={openCity}
            value={valueCity}
            items={itemsCity}
            setOpen={setOpenCity}
            setValue={(callback) => {
              const val = callback(valueCity);
              setValueCity(val);
              handleChange("addressCity", val);
            }}
            setItems={setItemsCity}
            placeholder="Chọn thành phố"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropContainer}
          />
        </View>


        {/* COUNTRY DROPDOWN */}
        <View style={[styles.dropdownWrapper, { zIndex: 1000 }]}>
          <DropDownPicker
            listMode="SCROLLVIEW"
            nestedScrollEnabled={true}
            open={openCountry}
            value={valueCountry}
            items={itemsCountry}
            setOpen={setOpenCountry}
            setValue={(callback) => {
              const val = callback(valueCountry);
              setValueCountry(val);
              handleChange("addressCountry", val);
            }}
            setItems={setItemsCountry}
            placeholder="Chọn quốc gia"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropContainer}
          />
        </View>


        {renderLabel('Loại hình công việc')}
        <TextInput style={styles.input} placeholder="Loại hình (Full-time, Part-time...)" value={form.employmentType} onChangeText={v => handleChange('employmentType', v)} />

        {renderLabel('Kỹ năng')}
        <TextInput style={styles.input} placeholder="Kỹ năng (cách nhau bằng dấu phẩy)" value={form.skills} onChangeText={v => handleChange('skills', v)} />

        {renderLabel('Chuyên môn')}
        <TextInput style={styles.input} placeholder="Chuyên môn (cách nhau bằng dấu phẩy)" value={form.jobExpertise} onChangeText={v => handleChange('jobExpertise', v)} />

        {renderLabel('Lĩnh vực')}
        <TextInput style={styles.input} placeholder="Lĩnh vực (cách nhau bằng dấu phẩy)" value={form.jobDomain} onChangeText={v => handleChange('jobDomain', v)} />

        {renderLabel('Mô tả công việc', true)}
        <TextInput style={[styles.input, { height: 80 }]} placeholder="Mô tả công việc" value={form.description} onChangeText={v => handleChange('description', v)} multiline />

      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 20, paddingTop: 64 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#337ab7', marginBottom: 16, paddingTop: 8 },
  fieldLabel: { fontWeight: 'bold', fontSize: 14, color: '#333', marginBottom: 6 },
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dropdownContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginLeft: 6,
    zIndex: 1000, // tránh overlay bị che
  },

  dropdown: {
    borderColor: "#ccc",
    height: 50,
  },

  dropContainer: {
    borderColor: "#ccc",
  },
  dropdownWrapper: {
    width: "100%",
    marginBottom: 15,
  },

  dropdown: {
    borderColor: "#ccc",
    height: 50,
    width: "100%",
  },

  dropContainer: {
    borderColor: "#ccc",
  },
  submitBtn: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center"
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  bannerWrapper: {
  marginBottom: 20,
},

createButton: {
  marginTop: 10,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: "center",
},

createButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},
});

export default EditJobScreen;
