import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../api';


export default function DetalheEvent() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/eventos/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      Alert.alert("Erro", "Não foi possível carregar o evento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c57f39" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Evento não encontrado.</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.titulo}</Text>

      {event.imagem ? (
        <Image source={{ uri: event.imagem }} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Text style={{ color: '#aaa' }}>Sem imagem</Text>
        </View>
      )}

      <Text style={styles.label}>Categoria:</Text>
      <Text style={styles.value}>{event.categoria}</Text>

      <Text style={styles.label}>Início:</Text>
      <Text style={styles.value}>
        {new Date(event.data).toLocaleString()}
      </Text>

      <Text style={styles.label}>Local:</Text>
      <Text style={styles.value}>{event.local}</Text>

      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{event.descricao}</Text>

      {event.chave_pix && (
        <>
          <Text style={styles.label}>Pix para pagamento:</Text>
          <Text style={[styles.value, styles.pixValue]}>{event.chave_pix}</Text>
        </>
      )}

      {/* Botões lado a lado */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>

      <TouchableOpacity 
  style={styles.button}
  onPress={() => router.push({
    pathname: '/Pagamento',
    params: { eventoId: event._id }
  })}
>
  <Text style={styles.buttonText}>Adquirir Ingresso</Text>
</TouchableOpacity>


      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 60,
    color: '#c57f39',
    textAlign: 'center'
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  noImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c57f39',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: 'white',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  pixValue: {
    marginBottom: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 20,
  },
  button: {
    backgroundColor: '#A46A32',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
