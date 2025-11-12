import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import api from '../../service/api';
import EmployerBanner from '../../components/EmployerBanner';

const JobDetailScreen = ({ route }) => {
  const { job } = route.params || {};
  const [jobDetail, setJobDetail] = useState(job || null);
  const [loading, setLoading] = useState(!job);

  useEffect(() => {
    if (!job) {
      fetchJobDetail();
    }
  }, []);

  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/jobs/${route.params.job._id}`);
      setJobDetail(response.data);
    } catch (error) {
      setJobDetail(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !jobDetail) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#337ab7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EmployerBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{jobDetail.title}</Text>
          <Text style={styles.company}>{jobDetail.companyName || 'Tên công ty'}</Text>
          <View style={styles.row}>
            <Text style={styles.posted}>Posted: {new Date(jobDetail.createdAt).toLocaleDateString()}</Text>
            <View style={styles.typeBadge}><Text style={styles.typeText}>{jobDetail.employmentType}</Text></View>
          </View>
          <View style={styles.salaryBadge}><Text style={styles.salaryText}>{jobDetail.salaryMin} - {jobDetail.salaryMax} USD</Text></View>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="map-marker" size={20} color="#337ab7" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <Text style={styles.value}>{jobDetail.address.line}, {jobDetail.address.city}, {jobDetail.address.country}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="star-circle" size={20} color="#337ab7" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Skills</Text>
            </View>
            <View style={styles.tagRow}>
              {jobDetail.skills.map((skill, idx) => (
                <View key={idx} style={styles.tag}><Text style={styles.tagText}>{skill}</Text></View>
              ))}
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="school" size={20} color="#337ab7" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Expertise</Text>
            </View>
            <View style={styles.tagRow}>
              {jobDetail.jobExpertise.map((exp, idx) => (
                <View key={idx} style={styles.tag}><Text style={styles.tagText}>{exp}</Text></View>
              ))}
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="domain" size={20} color="#337ab7" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Domain</Text>
            </View>
            <View style={styles.tagRow}>
              {jobDetail.jobDomain.map((domain, idx) => (
                <View key={idx} style={styles.tag}><Text style={styles.tagText}>{domain}</Text></View>
              ))}
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="file-document-outline" size={20} color="#337ab7" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.value}>{jobDetail.description}</Text>
          </View>
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#337ab7', marginBottom: 4 },
  company: { fontSize: 16, color: '#009688', fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  posted: { fontSize: 13, color: '#888' },
  typeBadge: {
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeText: { color: '#337ab7', fontWeight: 'bold', fontSize: 13 },
  salaryBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  salaryText: { color: '#009900', fontWeight: 'bold', fontSize: 16 },
  section: { marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  value: { fontSize: 15, color: '#333', marginTop: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  tag: {
    backgroundColor: '#e6f2ff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  tagText: { color: '#337ab7', fontWeight: '500', fontSize: 13 },
  date: { fontSize: 13, color: '#888', marginTop: 18, textAlign: 'right' },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});

export default JobDetailScreen;