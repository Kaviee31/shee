import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Maternity = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header Section */}
      <View style={{ backgroundColor: '#FFA07A', padding: 20, alignItems: 'center' }}>
        <Image source={require('../assets/baby.png')} style={{ width: 100, height: 100, borderRadius: 50 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10 }}>Maternity Care</Text>
      </View>
      
      {/* Activity Grid */}
      <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
          {activityData.map((item, index) => (
            <TouchableOpacity key={index} style={{ width: '40%', backgroundColor: '#FFEFD5', margin: 10, padding: 20, alignItems: 'center', borderRadius: 10 }}>
              <FontAwesome5 name={item.icon} size={30} color={item.color} />
              <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold', color: '#333' }}>{item.title}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{item.time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#FFA07A' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity><FontAwesome5 name="calendar" size={24} color="white" /></TouchableOpacity>
        <TouchableOpacity><FontAwesome5 name="chart-line" size={24} color="white" /></TouchableOpacity>
        <TouchableOpacity><FontAwesome5 name="cog" size={24} color="white" /></TouchableOpacity>
      </View>
    </View>
  );
};

const activityData = [
  { title: 'Breastfeeding', icon: 'baby', color: '#FF4500', time: '12:00 h' },
  { title: 'Pumping', icon: 'hand-holding-water', color: '#DA70D6', time: '12:00 h' },
  { title: 'Bottle Feeding', icon: 'wine-bottle', color: '#32CD32', time: '12:00 h' },
  { title: 'Diaper Change', icon: 'baby-carriage', color: '#1E90FF', time: '12:00 h' },
];

export default Maternity;
