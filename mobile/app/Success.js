import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';

export default function Success() {
  const router = useRouter();

  return (
    
    <View style={styles.container}>
      <Header/>
      <Text style={styles.title}>✅ Compra Realizada com Sucesso!</Text>

      <Button
        title="Voltar para Home"
        color="#c57f39"
        onPress={() => router.push('/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  title: { color: '#fff', fontSize: 22, textAlign: 'center', marginBottom: 20 },
});
