import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const EmployerBanner = ({ onProfilePress }) => (
  <View style={styles.banner}>
    <Text style={styles.title}>For Employers</Text>
    <View style={styles.rightIcons}>
      <TouchableOpacity style={styles.iconBtn}>
        <Icon name="message-outline" size={22} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn}>
        <Icon name="bell-outline" size={22} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileBtn} onPress={onProfilePress}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>t</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(90deg, #3a1c1c 0%, #6e2323 100%)',
    backgroundColor: '#3a1c1c', // fallback for RN
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 48,
    elevation: 4,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginHorizontal: 6,
  },
  profileBtn: {
    marginLeft: 8,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4caf50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'lowercase',
  },
});

export default EmployerBanner;
