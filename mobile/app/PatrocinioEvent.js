import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import api from '../api';
import { useLocalSearchParams } from 'expo-router';

export default function PatrocinioEvent() {
  const { eventoId } = useLocalSearchParams();

  const [evento, setEvento] = useState(null);
  const [valor, setValor] = useState('');
  const [payload, setPayload] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarEvento = async () => {
      if (!eventoId) {
        Alert.alert("Erro", "Evento não informado.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/eventos/${eventoId}`);
        setEvento(res.data);
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
        Alert.alert("Erro", "Não foi possível carregar o evento.");
      } finally {
        setLoading(false);
      }
    };
    buscarEvento();
  }, [eventoId]);

  const gerarPix = async () => {
    if (!valor) {
      Alert.alert("Informe um valor.");
      return;
    }

    if (!evento?.chave_pix) {
      Alert.alert("Chave Pix não cadastrada para esse evento.");
      return;
    }

    try {
      const res = await api.post('/gerar-pix', {
        chave: evento.chave_pix,
        nome: evento.titulo,
        cidade: 'BELO HORIZONTE',
        valor: valor.replace(",", ".")
      });

      setPayload(res.data.copiaecola);
    } catch (error) {
      console.error('Erro ao gerar Pix:', error);
      Alert.alert("Erro ao gerar Pix.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c57f39" />
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Evento não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Patrocinar o evento</Text>
      <Text style={styles.eventTitle}>{evento.titulo}</Text>

      <TextInput
        placeholder="Digite o valor do patrocínio"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        style={styles.input}
        placeholderTextColor="#fff"
      />

      <TouchableOpacity style={styles.payButton} onPress={gerarPix}>
        <Text style={styles.payButtonText}>Gerar Código Pix</Text>
      </TouchableOpacity>

      {payload !== '' && (
        <View style={styles.resultContainer}>
          <Text selectable style={styles.payload}>{payload}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', padding: 20, alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  title: { fontSize: 22, color: '#c57f39', fontWeight: 'bold', marginBottom: 10 },
  eventTitle: { fontSize: 18, color: '#fff', marginBottom: 20 },
  input: { backgroundColor: '#c57f39', width: '100%', padding: 15, borderRadius: 8, marginBottom: 10, color: '#fff' },
  payButton: { backgroundColor: '#A46A32', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, marginTop: 10, width: '100%' },
  payButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  resultContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginTop: 20, width: '100%' },
  payload: { color: '#000', fontSize: 14 },
  errorText: { color: '#fff', textAlign: 'center' }
});
