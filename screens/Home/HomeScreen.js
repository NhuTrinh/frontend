import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const features = [
  { key: 'recommended', label: 'Công việc', icon: require('../../assets/jobs.png'), color: '#EEEEEE' },
  { key: 'applied', label: 'Ứng viên', icon: require('../../assets/people.png'), color: '#EEEEEE' },
  { key: 'saved', label: 'Công ty', icon: require('../../assets/building.png'), color: '#EEEEEE' },
  { key: 'recent', label: 'Nhà tuyển dụng', icon: require('../../assets/recruiter.png'), color: '#EEEEEE' },
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#337ab7', '#4caf50']} style={styles.headerBox}>
        <View style={styles.headerTop}>
          <Image
            source={require('../../assets/avatar.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.headerTitle}>Dành cho nhà tuyển dụng</Text>
            <Text style={styles.location}>Thành phố Hồ Chí Minh</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Bắt đầu khám phá!</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Features Grid */}
      <Text style={styles.sectionTitle}>Chức năng</Text>
      <View style={styles.grid}>
        {features.slice(0, 4).map((f, idx) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.gridItem, { backgroundColor: f.color + '20' }]}
            onPress={
              idx === 1
                ? () => navigation.navigate('ApplicationList')
                : idx === 2
                  ? () => navigation.navigate('CompanyDetail')
                  : idx === 0
                    ? () => navigation.navigate('JobList')
                    : idx === 3
                      ? () => navigation.navigate('RecruiterInformationDetail')
                      : undefined
            }
          >
            <LinearGradient
              colors={[f.color, '#fff']}
              style={styles.iconWrapper}
            >
              <Image source={f.icon} style={styles.icon} />
            </LinearGradient>
            <Text style={styles.gridLabel}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fc',
    paddingTop: 40,
  },
  headerBox: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  location: {
    color: '#e0f2f1',
    fontSize: 14,
    marginTop: 2,
  },
  searchBtn: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16,
    color: 'green',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gridItem: {
    width: '40%',
    margin: 8,
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 20,
    elevation: 5,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  icon: {
    width: 32,
    height: 32,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;
