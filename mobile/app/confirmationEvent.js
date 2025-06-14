import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function ConfirmationEvent() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 20, marginBottom: 10 }}>
        Evento cadastrado com sucesso!
      </Text>
      <LottieView
        source={require('../assets/animations/confirmation.json')}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200, marginBottom: 100 }}
      />

      <Button title="Criar outro evento" onPress={() => router.push('/createEvent')} />
    </View>
  );
}
