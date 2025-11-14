import React, { useState, useEffect } from 'react';
import {KeyboardAvoidingView, View, Text, TextInput, StyleSheet, ScrollView, Button, Alert, Platform, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const cityOptions = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ'];
const countryOptions = ['Việt Nam', 'USA', 'Singapore', 'Japan'];
const typeOptions = ['Cổ phần', 'TNHH', 'Liên doanh', 'Khác'];
const sizeOptions = ['1-10 nhân viên', '11-50 nhân viên', '51-200 nhân viên', '201-500 nhân viên', '500+ nhân viên'];

const EditCompanyScreen = ({ route, navigation }) => {
  const { companyId } = route.params;
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    type: '',
    industry: '',
    size: '',
    addressLine: '',
    addressCity: '',
    addressCountry: '',
    workingDays: '',
    Overtime: '',
    overview: '',
    keySkills: '',
    perksContent: '',
    fanpageUrl: '',
    websiteUrl: '',
  });

  useEffect(() => {
    fetchCompanyDetail();
  }, []);

  const fetchCompanyDetail = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get(`/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const company = response.data;
      setForm({
        name: company.name || '',
        logo: company.logo || '',
        type: company.type || '',
        industry: company.industry || '',
        size: company.size || '',
        addressLine: company.address?.line || '',
        addressCity: company.address?.city || '',
        addressCountry: company.address?.country || '',
        workingDays: company.workingDays || '',
        Overtime: company.Overtime || '',
        overview: company.overview || '',
        keySkills: (company.keySkills || []).join(', '),
        perksContent: company.perksContent || '',
        fanpageUrl: company.fanpageUrl || '',
        websiteUrl: company.websiteUrl || '',
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin công ty');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.logo || !form.type || !form.industry || !form.size || !form.addressLine || !form.addressCity || !form.addressCountry) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const body = {
        name: form.name,
        logo: form.logo,
        type: form.type,
        industry: form.industry,
        size: form.size,
        address: {
          line: form.addressLine,
          city: form.addressCity,
          country: form.addressCountry,
        },
        workingDays: form.workingDays,
        Overtime: form.Overtime,
        overview: form.overview,
        keySkills: form.keySkills.split(',').map(s => s.trim()),
        perksContent: form.perksContent,
        fanpageUrl: form.fanpageUrl,
        websiteUrl: form.websiteUrl,
      };
      await api.put(`/companies/${companyId}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Toast.show({
            type: 'success',
            text1: 'Cập nhật thành công',
            text2: 'Thông tin công ty đã được cập nhật ✔️',
            position: 'bottom',
          });
      navigation.goBack();
    } catch (error) {
      Toast.show({
            type: 'error',
            text1: 'Lỗi cập nhật',
            text2: error?.response?.data?.message || 'Không thể cập nhật công ty.',
            position: 'bottom',
          });
    } finally {
      setLoading(false);
    }
  };

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
                  <Text style={styles.createButtonText}>Cập nhật công ty</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
       <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // điều chỉnh tùy header
                  >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
        </View>
        <Text style={styles.title}>Cập nhật thông tin công ty</Text>
        <TextInput style={styles.input} placeholder="Tên công ty" value={form.name} onChangeText={v => handleChange('name', v)} editable={isEditing} />
        <TextInput style={styles.input} placeholder="Logo URL" value={form.logo} onChangeText={v => handleChange('logo', v)} editable={isEditing} />
        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Loại hình</Text>
            <TextInput style={styles.input} placeholder="Loại hình" value={form.type} onChangeText={v => handleChange('type', v)} editable={isEditing} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Quy mô</Text>
            <TextInput style={styles.input} placeholder="Quy mô" value={form.size} onChangeText={v => handleChange('size', v)} editable={isEditing} />
          </View>
        </View>
        <TextInput style={styles.input} placeholder="Ngành" value={form.industry} onChangeText={v => handleChange('industry', v)} editable={isEditing} />
        <TextInput style={styles.input} placeholder="Ngày làm việc" value={form.workingDays} onChangeText={v => handleChange('workingDays', v)} editable={isEditing} />
        <TextInput style={styles.input} placeholder="Overtime" value={form.Overtime} onChangeText={v => handleChange('Overtime', v)} editable={isEditing} />
        <TextInput style={styles.input} placeholder="Địa chỉ (số, đường)" value={form.addressLine} onChangeText={v => handleChange('addressLine', v)} editable={isEditing} />
        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Thành phố</Text>
            <TextInput style={styles.input} placeholder="Thành phố" value={form.addressCity} onChangeText={v => handleChange('addressCity', v)} editable={isEditing} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Quốc gia</Text>
            <TextInput style={styles.input} placeholder="Quốc gia" value={form.addressCountry} onChangeText={v => handleChange('addressCountry', v)} editable={isEditing} />
          </View>
        </View>
        <TextInput style={styles.input} placeholder="Giới thiệu công ty" value={form.overview} onChangeText={v => handleChange('overview', v)} editable={isEditing} multiline />
        <TextInput style={styles.input} placeholder="Phúc lợi" value={form.perksContent} onChangeText={v => handleChange('perksContent', v)} editable={isEditing} multiline />
        <TextInput style={styles.input} placeholder="Kỹ năng nổi bật (cách nhau bằng dấu phẩy)" value={form.keySkills} onChangeText={v => handleChange('keySkills', v)} editable={isEditing} />
        <TextInput style={styles.input} placeholder="Fanpage URL" value={form.fanpageUrl} onChangeText={v => handleChange('fanpageUrl', v)} editable={isEditing} />
        <TextInput style={styles.input} placeholder="Website URL" value={form.websiteUrl} onChangeText={v => handleChange('websiteUrl', v)} editable={isEditing} />
      </ScrollView>
      </KeyboardAvoidingView>
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
  label: { fontSize: 14, color: '#337ab7', marginBottom: 4 },
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

export default EditCompanyScreen;
