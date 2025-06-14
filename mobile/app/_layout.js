import { Slot } from 'expo-router';
import { View, StyleSheet, StatusBar } from 'react-native';
import Header from '../components/Header';
import { UserProvider } from '../context/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <View style={styles.container}>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
        <Header />
        <View style={styles.content}>
          <Slot /> 
        </View>
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
  },
});
