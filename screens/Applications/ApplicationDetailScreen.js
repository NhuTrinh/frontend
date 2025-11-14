import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Card } from 'react-native-paper';
import EmployerBanner from '../../components/EmployerBanner';

const ApplicationDetailScreen = ({ route, navigation }) => {
  const { candidate, jobList } = route.params;
  const profile = candidate.profile || {};
  const account = candidate.accountId || {};
  const address = profile.address || {};
  const jobsApplied = jobList || [];

  console.log('Jobs Applied:', jobsApplied);

  const openLink = (url) => {
    if (url) Linking.openURL(url).catch(err => console.error('Failed to open URL', err));
  };

  const renderJobItem = ({ item }) => {
    console.log('Rendering job item:', item);
    const job = item;
    console.log('Job details:', job);
    return (
      <View style={styles.jobCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.jobTitle}>{job.title || job.jobTitle}</Text>
          <Text style={styles.jobInfo}>
            📍 {job.address?.city || 'Unknown'}, {job.address?.country || ''}
          </Text>
          <Text style={styles.jobInfo}>
            💰 {job.salaryMin} - {job.salaryMax} USD | {job.employmentType}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => navigation.navigate('JobDetail', { job })}
        >
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ListHeader = () => (
    <>
      {/* Banner */}
      <View style={styles.bannerWrapper}>
        <EmployerBanner />
      </View>

      {/* Avatar & Basic Info */}
      <View style={styles.header}>
        <Image
          source={profile.avatar ? { uri: profile.avatar } : require('../../assets/default-avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{account.fullName}</Text>
        <Text style={styles.jobTitleText}>{profile.jobTitle || 'Chưa cập nhật vị trí'}</Text>
        <Text style={styles.location}>📍 {address.city || ''}, {address.country || ''}</Text>
      </View>

      {/* About me */}
      {profile.aboutMe && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Giới thiệu bản thân</Text>
          <Text>{profile.aboutMe}</Text>
        </Card>
      )}

      {/* Work Experience */}
      {profile.workExperience?.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Kinh nghiệm làm việc</Text>
          {profile.workExperience.map((exp, idx) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.itemTitle}>{exp.jobTitle} - {exp.companyName}</Text>
              <Text>{new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()}</Text>
              {exp.description && <Text>{exp.description}</Text>}
              {exp.project && <Text>Dự án: {exp.project}</Text>}
            </View>
          ))}
        </Card>
      )}

      {/* Education */}
      {profile.education?.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Học vấn</Text>
          {profile.education.map((edu, idx) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.itemTitle}>{edu.degree} {edu.major} - {edu.schoolName}</Text>
              <Text>{new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}</Text>
              {edu.description && <Text>{edu.description}</Text>}
            </View>
          ))}
        </Card>
      )}

      {/* Skills */}
      {profile.skills?.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Kỹ năng</Text>
          {profile.skills.map((skillObj, idx) => (
            <View key={idx} style={styles.skillRow}>
              {skillObj.coreSkills?.map((skill, i) => (
                <Text key={i} style={styles.skillTag}>{skill}</Text>
              ))}
            </View>
          ))}
        </Card>
      )}

      {/* Foreign Languages */}
      {profile.foreignLanguages?.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Ngoại ngữ</Text>
          {profile.foreignLanguages.map((lang, idx) => (
            <Text key={idx}>{lang.language} - {lang.level}</Text>
          ))}
        </Card>
      )}

      {/* Highlight Projects */}
      {profile.highlightProjects?.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Dự án nổi bật</Text>
          {profile.highlightProjects.map((proj, idx) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.itemTitle}>{proj.name}</Text>
              <Text>{new Date(proj.startDate).toLocaleDateString()} - {new Date(proj.endDate).toLocaleDateString()}</Text>
              {proj.description && <Text>{proj.description}</Text>}
              {proj.projectUrl && (
                <TouchableOpacity onPress={() => openLink(proj.projectUrl)}>
                  <Text style={styles.link}>{proj.projectUrl}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Card>
      )}

      {/* Certificates */}
      {profile.certificates?.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Chứng chỉ</Text>
          {profile.certificates.map((cert, idx) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.itemTitle}>{cert.name} - {cert.organization}</Text>
              {cert.certificateUrl && (
                <TouchableOpacity onPress={() => openLink(cert.certificateUrl)}>
                  <Text style={styles.link}>{cert.certificateUrl}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Card>
      )}

      {/* Awards */}
      {profile.awards?.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Giải thưởng</Text>
          {profile.awards.map((award, idx) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.itemTitle}>{award.name} - {award.organization}</Text>
              {award.description && <Text>{award.description}</Text>}
            </View>
          ))}
        </Card>
      )}

      {/* LinkedIn */}
      {profile.link && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>LinkedIn</Text>
          <TouchableOpacity onPress={() => openLink(profile.link)}>
            <Text style={styles.link}>{profile.link}</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Section Title for Jobs Applied */}
      {profile.link && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Jobs Applied</Text>
        </Card>
      )}
      
    </>
  );

  return (
    <FlatList
      data={jobsApplied}
      keyExtractor={(item) => item._id}
      renderItem={renderJobItem}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListHeaderComponent={ListHeader}
    />
  );
};

export default ApplicationDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8fc' },
  bannerWrapper: {
    marginBottom: 12,
  },
  header: { alignItems: 'center', marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8, backgroundColor: '#ccc' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  jobTitleText: { fontSize: 16, color: '#337ab7', marginBottom: 4 },
  location: { fontSize: 14, color: '#666' },
  card: { marginBottom: 12, padding: 12, borderRadius: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#337ab7' },
  item: { marginBottom: 6 },
  itemTitle: { fontWeight: 'bold' },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  skillTag: { backgroundColor: '#e6f2ff', color: '#337ab7', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginRight: 4, marginBottom: 4 },
  link: { color: '#0066FF', textDecorationLine: 'underline' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#337ab7', marginLeft: 12, marginBottom: 8, marginTop: 12 },
  jobCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  jobInfo: { fontSize: 13, color: '#555', marginTop: 2 },
  viewBtn: {
    backgroundColor: '#337ab7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  viewBtnText: { color: '#fff', fontWeight: 'bold' },
});
