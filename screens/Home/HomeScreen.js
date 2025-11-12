import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const features = [
  { key: 'recommended', label: 'Recommended Jobs', icon: require('../../assets/jobs.png') },
  { key: 'applied', label: 'Applied Jobs', icon: require('../../assets/jobs.png') },
  { key: 'saved', label: 'Saved Jobs', icon: require('../../assets/building.png') },
  { key: 'recent', label: 'Recent Searches', icon: require('../../assets/building.png') },
  { key: 'map', label: 'Map Search', icon: require('../../assets/people.png') },
  { key: 'parttime', label: 'Part time Jobs', icon: require('../../assets/people.png') },
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Customer Service Representative</Text>
        <Text style={styles.location}>Current Location</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Begin Your Job Search!</Text>
        </TouchableOpacity>
      </View>
      {/* Features grid */}
      <Text style={styles.sectionTitle}>Your Jobs And Activity</Text>
      <View style={styles.grid}>
        {features.slice(0,4).map((f, idx) => (
          <TouchableOpacity
            key={f.key}
            style={styles.gridItem}
            onPress={idx === 2 ? () => navigation.navigate('CompanyDetail') : undefined}
          >
            <Image source={f.icon} style={styles.icon} />
            <Text style={styles.gridLabel}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Not Sure Where To Begin?</Text>
      <View style={styles.grid}>
        {features.slice(4).map(f => (
          <TouchableOpacity key={f.key} style={styles.gridItem}>
            <Image source={f.icon} style={styles.icon} />
            <Text style={styles.gridLabel}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Bottom tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('JobList')}>
          <Text style={styles.tabLabel}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}><Text style={styles.tabLabel}>Resume</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}><Text style={styles.tabLabel}>Profile</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}><Text style={styles.tabLabel}>Settings</Text></TouchableOpacity>
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
    backgroundColor: '#337ab7',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 12,
  },
  searchBtn: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 16,
    color: '#337ab7',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridItem: {
    width: '40%',
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 10,
    alignItems: 'center',
    padding: 16,
    elevation: 2,
  },
  icon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 14,
    color: '#337ab7',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    color: '#337ab7',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default HomeScreen;
