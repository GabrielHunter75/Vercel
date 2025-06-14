import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function MeusIngressos() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);




useEffect(() => {
  async function fetchCompras() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);
      const res = await api.get(`/compras?userId=${user._id}`);
      setCompras(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  fetchCompras();
}, []);


  if (loading) {
    return <ActivityIndicator size="large" color="#c57f39" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Ingressos</Text>

      <FlatList
        data={compras}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Evento: {item.eventId.titulo}</Text>
            <Text style={styles.label}>Forma: {item.metodoPagamento}</Text>
            <Text style={styles.label}>Valor: R$ {item.valorPago}</Text>
            <Text style={styles.label}>Data: {new Date(item.dataCompra).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 22, color: '#fff', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 15 },
  label: { color: '#fff', marginBottom: 5 }
});
