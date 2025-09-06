import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Image, SafeAreaView, ScrollView, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [screenSlideAnim] = useState(new Animated.Value(300)); // Start from right

  useEffect(() => {
    // Slide in from right animation
    Animated.spring(screenSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load profile from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
      }

      if (profile) {
        // Parse full name if it exists
        const fullName = profile.full_name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFirstName(firstName);
        setLastName(lastName);
        setEmail(profile.email || user.email || '');
        setPhone(profile.phone || '');
        setBio(profile.bio || '');
        setAvatarUrl(profile.avatar_url || '');
      } else {
        // Use basic user data if no profile exists
        const fullName = user.fullName || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFirstName(firstName);
        setLastName(lastName);
        setEmail(user.email || '');
        setPhone('');
        setBio('');
        setAvatarUrl('');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Facebook-style default avatar generator
  const generateDefaultAvatar = (name: string) => {
    if (!name) return null;
    
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const colorIndex = name.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return { initials, backgroundColor };
  };

  const getAvatarDisplay = () => {
    if (avatarUrl) {
      return <Image source={{ uri: avatarUrl }} style={styles.avatar} />;
    }
    
    const fullName = `${firstName} ${lastName}`.trim();
    const defaultAvatar = generateDefaultAvatar(fullName);
    
    if (defaultAvatar) {
      return (
        <View style={[styles.defaultAvatar, { backgroundColor: defaultAvatar.backgroundColor }]}>
          <CustomText variant="h2" style={styles.avatarInitials}>
            {defaultAvatar.initials}
          </CustomText>
        </View>
      );
    }
    
    return (
      <View style={styles.defaultAvatar}>
        <Ionicons name="person" size={40} color={Colors.neutrals.white} />
      </View>
    );
  };

  const handleSave = async () => {
    // Validate required fields
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      // Upsert profile data
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: email.trim(),
          full_name: fullName,
          phone: phone.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving profile:', error);
        Alert.alert('Error', 'Failed to save profile. Please try again.');
        return;
      }

      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option to update your profile photo',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            // In a real app, this would open the camera
            Alert.alert('Camera', 'Camera functionality would open here');
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            // In a real app, this would open the image picker
            Alert.alert('Gallery', 'Image picker would open here');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
             <Animated.View 
         style={[
           styles.container,
           {
             transform: [{ translateX: screenSlideAnim }],
           }
         ]}
       >
        <SafeAreaView style={styles.safeArea}>
      {/* Header with Gradient */}
      <View>
        <LinearGradient
          colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neutrals.white} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <CustomText variant="h2" style={styles.headerTitle}>Edit Profile</CustomText>
              <CustomText variant="body" style={styles.headerSubtitle}>Update your personal information</CustomText>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <CustomText variant="buttonText" style={styles.saveButtonText}>Save</CustomText>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {loading ? (
              <View style={styles.profilePhoto}>
                <Ionicons name="person" size={40} color={Colors.neutrals.gray400} />
              </View>
            ) : (
              getAvatarDisplay()
            )}
            <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
              <Ionicons name="camera" size={20} color={Colors.neutrals.white} />
            </TouchableOpacity>
          </View>
          <CustomText variant="bodySmall" style={styles.photoHint}>Tap to change photo</CustomText>
        </View>

        {/* Form Sections */}
        <View style={[styles.formSection, {  }]}>
          <CustomText variant="h3" style={styles.sectionTitle}>Personal Information</CustomText>
          
          <View style={styles.inputGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>First Name</CustomText>
            <TextInput
              style={styles.textInput}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor={Colors.neutrals.darkGray}
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Last Name</CustomText>
            <TextInput
              style={styles.textInput}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor={Colors.neutrals.darkGray}
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Email Address</CustomText>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor={Colors.neutrals.darkGray}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Phone Number</CustomText>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.neutrals.darkGray}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={[styles.formSection, {  }]}>
          <CustomText variant="h3" style={styles.sectionTitle}>About Me</CustomText>
          
          <View style={styles.inputGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Bio</CustomText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={Colors.neutrals.darkGray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

             </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,
  } as ViewStyle,
  safeArea: {
    flex: 1,
  } as ViewStyle,
  header: {
    paddingTop: DesignTokens.spacing.xl,
    paddingBottom: DesignTokens.spacing.xl,
    paddingHorizontal: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  backButton: {
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  headerTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  } as TextStyle,
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
  } as ViewStyle,
  saveButtonText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  photoSection: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xl,
  } as ViewStyle,
  photoContainer: {
    position: 'relative',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: Colors.neutrals.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,
  avatar: {
    width: 120,
    height: 120,
    borderRadius: DesignTokens.borderRadius.circular,
  } as any,
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: DesignTokens.borderRadius.circular,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,
  avatarInitials: {
    color: Colors.neutrals.white,
    fontWeight: 'bold',
  } as TextStyle,
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.circular,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.neutrals.white,
  } as ViewStyle,
  photoHint: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  formSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  inputGroup: {
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  inputLabel: {
    color: Colors.neutrals.darkGray,
    marginBottom: DesignTokens.spacing.xs,
    fontWeight: '600',
  } as TextStyle,
  textInput: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
    fontSize: DesignTokens.typography.body.fontSize,
    color: Colors.neutrals.charcoal,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  } as TextStyle,
  textArea: {
    height: 100,
    paddingTop: DesignTokens.spacing.md,
  } as TextStyle,
});
