import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setName(data.name || '');
        setEmail(data.email || '');
        setEmergencyContactName(data.emergencyContact?.name || '');
        setEmergencyContactPhone(data.emergencyContact?.phone || '');
      }
      const storedProfileImage = await AsyncStorage.getItem('profile_image');
      if (storedProfileImage) setProfileImage(storedProfileImage);
    };
    fetchUserData();
  }, [user]);

  const updateUserProfile = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
        },
      }, { merge: true });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem('profile_image', imageUri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={profileImage ? { uri: profileImage } : require('../assets/profile-placeholder.png')} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={[styles.input, isEditing ? styles.editable : styles.disabled]} value={name} onChangeText={setName} editable={isEditing} />
      <Text style={styles.label}>Email:</Text>
      <TextInput style={[styles.input, styles.disabled]} value={email} editable={false} />
      <Text style={styles.label}>Emergency Contact Name:</Text>
      <TextInput style={[styles.input, isEditing ? styles.editable : styles.disabled]} value={emergencyContactName} onChangeText={setEmergencyContactName} editable={isEditing} />
      <Text style={styles.label}>Emergency Contact Phone:</Text>
      <TextInput style={[styles.input, isEditing ? styles.editable : styles.disabled]} value={emergencyContactPhone} onChangeText={setEmergencyContactPhone} editable={isEditing} keyboardType="phone-pad" />
      <TouchableOpacity style={styles.button} onPress={() => { isEditing ? updateUserProfile() : setIsEditing(true); }}>
        <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#ffb6c1' },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderRadius: 8, fontSize: 16, marginBottom: 15 },
  editable: { borderColor: '#3498db', backgroundColor: '#fff' },
  disabled: { borderColor: '#ddd', backgroundColor: '#f2f2f2' },
  button: { marginTop: 10, padding: 14, backgroundColor: '#ff4f70', borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ProfileScreen;
