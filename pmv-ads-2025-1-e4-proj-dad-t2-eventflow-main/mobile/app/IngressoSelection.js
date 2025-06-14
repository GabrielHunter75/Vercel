import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function IngressoSelection() {
  const router = useRouter();
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [descricao, setDescricao] = useState('');

  const formatarMoeda = (valor) => {
    const num = valor.replace(/\D/g, '');
    const numero = (parseFloat(num) / 100).toFixed(2);
    return `R$ ${numero.replace('.', ',')}`;
  };

  const removerFormatacao = (valor) => valor.replace(/\D/g, '');

  const handleSave = () => {
    if (!preco || !quantidade) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const precoSemMascara = parseFloat((parseInt(removerFormatacao(preco)) / 100).toFixed(2));
    const ticketData = { preco: precoSemMascara, quantidade: parseInt(quantidade), descricao };

    router.push({ pathname: '/createEvent', params: { ticket: JSON.stringify(ticketData) } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar Ingresso</Text>
      <TextInput style={styles.input} placeholder="Preço (R$)" value={preco} onChangeText={(t) => setPreco(formatarMoeda(t))} keyboardType="numeric" placeholderTextColor="#fff" />
      <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholderTextColor="#fff" />
      <TextInput style={styles.input} placeholder="Descrição (opcional)" value={descricao} onChangeText={setDescricao} placeholderTextColor="#fff" />
      <Button title="Salvar Ingresso" onPress={handleSave} color="#A46A32" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  title: { color: '#fff', fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#c57f39', marginBottom: 15, padding: 15, borderRadius: 8, color: '#fff' }
});
