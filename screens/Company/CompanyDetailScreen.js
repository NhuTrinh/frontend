import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';

const CompanyDetailScreen = ({ navigation }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyIdAndDetail();
  }, []);

  const fetchCompanyIdAndDetail = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      // Lấy profile để lấy companyId
      const profileRes = await api.get('/recruiters/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const companyId = profileRes.data?.recruiter?.companyId;
      if (!companyId) throw new Error('Không tìm thấy companyId');
      // Lấy thông tin công ty
      const companyRes = await api.get(`/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompany(companyRes.data);
    } catch (error) {
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#337ab7" /></View>;
  }

  if (!company) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Không tìm thấy thông tin công ty</Text></View>;
  }

  return (
    <View style={styles.container}>
      <EmployerBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerBox}>
            <Image
               source={require('../../assets/company.png')}
              style={styles.logo}
            />
            <Text style={styles.name}>{company.name}</Text>
            <Text style={styles.industry}>{company.industry}</Text>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>{company.size}</Text>
              <Text style={styles.badge}>{company.type}</Text>
              <Text style={styles.badge}>{company.workingDays}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Địa chỉ</Text>
            <Text style={styles.value}>{company.address?.line}, {company.address?.city}, {company.address?.country}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu công ty</Text>
            <Text style={styles.desc}>{company.overview}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phúc lợi</Text>
            <Text style={styles.desc}>{company.perksContent}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kỹ năng nổi bật</Text>
            <View style={styles.skillRow}>
              {(company.keySkills || []).map((skill, idx) => (
                <View key={idx} style={styles.skillTag}><Text style={styles.skillText}>{skill}</Text></View>
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin khác</Text>
            <Text style={styles.value}>Overtime: {company.Overtime}</Text>
            <Text style={styles.value}>Fanpage: <Text style={styles.link}>{company.fanpageUrl}</Text></Text>
            <Text style={styles.value}>Website: <Text style={styles.link}>{company.websiteUrl}</Text></Text>
          </View>
          <Button
            title="Chỉnh sửa thông tin công ty"
            color="#337ab7"
            onPress={() => navigation.navigate('EditCompany', { companyId: company._id })}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 20, paddingTop: 64 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 24,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b3d1ff',
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#337ab7', marginBottom: 4 },
  industry: { fontSize: 16, color: '#009688', fontWeight: '500', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  badge: {
    backgroundColor: '#e6f2ff',
    color: '#337ab7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    fontWeight: 'bold',
    fontSize: 13,
  },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#337ab7', marginBottom: 6 },
  value: { fontSize: 15, color: '#333', marginTop: 2 },
  desc: { fontSize: 15, color: '#333', marginTop: 2 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  skillTag: {
    backgroundColor: '#e6f2ff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  skillText: { color: '#337ab7', fontWeight: '500', fontSize: 13 },
  link: { color: '#337ab7', textDecorationLine: 'underline' },
});

export default CompanyDetailScreen;
