import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ImageBackground, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const facts = [
  { id: '1', text: "Women's safety is a global priority. Always share your location with trusted contacts." },
  { id: '2', text: "Regular health checkups can prevent major diseases. Early detection is key." },
  { id: '3', text: "Self-defense training empowers women to feel more secure in public spaces." },
  { id: '4', text: "Drinking water and proper nutrition improve overall health and well-being." },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto-scroll effect
  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (flatListRef.current) {
        index = (index + 1) % facts.length;
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground source={require('../assets/login1.jpg')} style={styles.background}>
      <View style={styles.container}>

        {/* Profile Icon Button */}
        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-circle-outline" size={40} color="#fff" />
        </TouchableOpacity>

        {/* Sliding Info Cards */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={facts}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.factText}>{item.text}</Text>
              </View>
            )}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          />
        </View>

        {/* Grid Buttons at the Bottom */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('Safety')}>
            <Text style={styles.gridText}>Women Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('Healthcare')}>
            <Text style={styles.gridText}>Healthcare</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
  },
  profileIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  carouselContainer: {
    marginTop: 100,
    height: 160,
    width: width * 0.85,
  },
  card: {
    width: width * 0.85,
    backgroundColor: 'rgba(249, 194, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginHorizontal: 10,
  },
  factText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 30,
  },
  gridButton: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#6200ea',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  gridText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
