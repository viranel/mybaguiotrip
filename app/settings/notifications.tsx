import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';

export default function NotificationsScreen() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [tripUpdates, setTripUpdates] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [news, setNews] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const requestPermission = () => {
    Alert.alert(
      'Allow Notifications',
      'My Baguio Trip would like to send you notifications for trip updates and reminders.',
      [
        { text: 'Don\'t Allow', style: 'cancel' },
        { text: 'Allow', onPress: () => setPermissionGranted(true) }
      ]
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.appIdentity.primaryBrand} />
        <CustomText variant="h3" style={styles.loadingText}>
          Loading notifications...
        </CustomText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <CustomText variant="heading" style={styles.headerTitle}>Notifications</CustomText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <CustomText variant="subtitle" style={styles.sectionTitle}>Permissions</CustomText>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#3B82F615' }]}>
                <Ionicons name="notifications" size={22} color="#3B82F6" />
              </View>
              <View>
                <CustomText variant="title">Push Notifications</CustomText>
                <CustomText variant="caption" style={styles.itemSubtitle}>
                  {permissionGranted ? 'Enabled in system settings' : 'Disabled - tap to enable'}
                </CustomText>
              </View>
            </View>
            <TouchableOpacity onPress={requestPermission}>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <CustomText variant="subtitle" style={styles.sectionTitle}>Categories</CustomText>

          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#10B98115' }]}>
                <Ionicons name="airplane" size={22} color="#10B981" />
              </View>
              <CustomText variant="title">Trip Updates</CustomText>
            </View>
            <Switch value={tripUpdates} onValueChange={setTripUpdates} />
          </View>

          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F59E0B15' }]}>
                <Ionicons name="time" size={22} color="#F59E0B" />
              </View>
              <CustomText variant="title">Reminders</CustomText>
            </View>
            <Switch value={reminders} onValueChange={setReminders} />
          </View>

          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#8B5CF615' }]}>
                <Ionicons name="newspaper" size={22} color="#8B5CF6" />
              </View>
              <CustomText variant="title">News & Tips</CustomText>
            </View>
            <Switch value={news} onValueChange={setNews} />
          </View>

          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#EF444415' }]}>
                <Ionicons name="pricetag" size={22} color="#EF4444" />
              </View>
              <CustomText variant="title">Marketing</CustomText>
            </View>
            <Switch value={marketing} onValueChange={setMarketing} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF7F0' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 20,
    color: Colors.appIdentity.primaryBrand,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FEF7F0',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
  },
  headerTitle: { color: '#1F2937' },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center'
  },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginTop: 24 },
  sectionTitle: { color: '#6B7280', marginBottom: 16, paddingLeft: 4 },
  itemRow: {
    backgroundColor: '#FEF7F0', borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemSubtitle: { color: '#6B7280' }
});

