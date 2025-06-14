import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Linking } from 'react-native';
import api from '../api';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Pagamento() {
  const { eventoId, userId } = useLocalSearchParams();
  const router = useRouter();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [total, setTotal] = useState(0);
  const [maxIngressos, setMaxIngressos] = useState(1);
  const [nomesParticipantes, setNomesParticipantes] = useState([]);
  const [payloadPix, setPayloadPix] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const [pdfUrl, setPdfUrl] = useState('');

  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [validadeCartao, setValidadeCartao] = useState('');
  const [cvvCartao, setCvvCartao] = useState('');

  useEffect(() => {
    const buscarEvento = async () => {
      try {
        const res = await api.get(`/eventos/${eventoId}`);
        setEvento(res.data);
        const preco = res.data?.ingresso?.preco || 0;
        const quantidadeDisponivel = res.data?.ingresso?.quantidade || 1;

        setPrecoUnitario(preco);
        setMaxIngressos(quantidadeDisponivel);
        setTotal(0);
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
        Alert.alert("Erro ao buscar evento");
      } finally {
        setLoading(false);
      }
    };

    buscarEvento();
  }, [eventoId]);

  useEffect(() => {
    setTotal(precoUnitario * quantidade);
    setNomesParticipantes(Array(quantidade).fill(''));
  }, [quantidade]);

  const handleNomeChange = (index, nome) => {
    const novosNomes = [...nomesParticipantes];
    novosNomes[index] = nome;
    setNomesParticipantes(novosNomes);
  };

  const validarNomes = () => {
    return nomesParticipantes.every(nome => nome.trim() !== '');
  };

  const gerarPix = async () => {
    if (quantidade === 0) {
      Alert.alert("Selecione a quantidade de ingressos.");
      return;
    }

    if (!validarNomes()) {
      Alert.alert("Preencha o nome de todos os participantes.");
      return;
    }

    if (!evento?.chave_pix) {
      Alert.alert("Chave Pix não cadastrada.");
      return;
    }

    try {
      const res = await api.post('/gerar-pix', {
        chave: evento.chave_pix,
        nome: evento.titulo,
        cidade: 'BELO HORIZONTE',
        valor: total
      });
      setPayloadPix(res.data.copiaecola);

      await registrarCompra('pix');
    } catch {
      Alert.alert("Erro ao gerar Pix");
    }
  };

  const registrarCompra = async (metodoPagamento) => {
    try {
      const res = await api.post('/compras', {
        userId,
        eventId: eventoId,
        metodoPagamento,
        valorPago: total,
        nomesParticipantes
      });

      if (res.data.pdfUrl) {
        setPdfUrl(res.data.pdfUrl);
      }

    } catch (err) {
      Alert.alert("Erro ao registrar compra.");
    }
  };

  const handleCartaoPagamento = () => {
    if (quantidade === 0) {
      Alert.alert("Selecione a quantidade de ingressos.");
      return;
    }
    if (!validarNomes()) {
      Alert.alert("Preencha o nome de todos os participantes.");
      return;
    }
    if (!numeroCartao || !nomeCartao || !validadeCartao || !cvvCartao) {
      Alert.alert("Preencha todos os campos do cartão.");
      return;
    }
    if (!validarCartaoLuhn(numeroCartao)) {
      Alert.alert("Número do cartão inválido.");
      return;
    }
    if (!validarDataValidade(validadeCartao)) {
      Alert.alert("Validade inválida.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvvCartao)) {
      Alert.alert("CVV inválido.");
      return;
    }

    Alert.alert("Pagamento aprovado!", `Total: R$ ${total.toFixed(2).replace('.', ',')}`);
    registrarCompra('cartao');
  };

  const validarCartaoLuhn = (numero) => {
    const num = numero.replace(/\D/g, '');
    let soma = 0;
    let alternar = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num.charAt(i));
      if (alternar) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      soma += n;
      alternar = !alternar;
    }
    return soma % 10 === 0;
  };

  const validarDataValidade = (data) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(data)) return false;

    const [mes, ano] = data.split('/');
    const hoje = new Date();
    const anoAtual = parseInt(hoje.getFullYear().toString().slice(-2));
    const mesAtual = hoje.getMonth() + 1;

    if (parseInt(ano) < anoAtual) return false;
    if (parseInt(ano) === anoAtual && parseInt(mes) < mesAtual) return false;

    return true;
  };

  const aumentarQuantidade = () => {
    if (quantidade < maxIngressos) {
      setQuantidade(quantidade + 1);
    } else {
      Alert.alert(`Máximo de ingressos: ${maxIngressos}`);
    }
  };

  const diminuirQuantidade = () => {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#c57f39" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{evento.titulo}</Text>
      <Text style={styles.label}>Preço unitário: R$ {precoUnitario.toFixed(2).replace('.', ',')}</Text>
      <Text style={styles.label}>Ingressos disponíveis: {maxIngressos}</Text>

      <Text style={styles.label}>Selecione a quantidade de ingressos:</Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity style={styles.stepperButton} onPress={diminuirQuantidade}><Text style={styles.stepperText}>-</Text></TouchableOpacity>
        <Text style={styles.quantityText}>{quantidade}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={aumentarQuantidade}><Text style={styles.stepperText}>+</Text></TouchableOpacity>
      </View>

      {nomesParticipantes.map((nome, index) => (
        <TextInput
          key={index}
          placeholder={`Nome do participante ${index + 1}`}
          style={styles.input}
          value={nome}
          onChangeText={(text) => handleNomeChange(index, text)}
          placeholderTextColor="#fff"
        />
      ))}

      <Text style={styles.label}>Total: R$ {total.toFixed(2).replace('.', ',')}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.paymentButton, selectedMethod === 'pix' && styles.selectedButton]} onPress={() => setSelectedMethod('pix')}>
          <Text style={styles.paymentButtonText}>Pix</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.paymentButton, selectedMethod === 'cartao' && styles.selectedButton]} onPress={() => setSelectedMethod('cartao')}>
          <Text style={styles.paymentButtonText}>Cartão</Text>
        </TouchableOpacity>
      </View>

      {selectedMethod === 'pix' && (
        <>
          <TouchableOpacity style={styles.payButton} onPress={gerarPix}>
            <Text style={styles.payButtonText}>Gerar Pix</Text>
          </TouchableOpacity>

          {payloadPix !== '' && (
            <View style={styles.resultContainer}>
              <Text selectable>{payloadPix}</Text>
            </View>
          )}
        </>
      )}

      {selectedMethod === 'cartao' && (
        <>
          <TextInput placeholder="Número do cartão" style={styles.input} value={numeroCartao} onChangeText={setNumeroCartao} placeholderTextColor="#fff" keyboardType="numeric" />
          <TextInput placeholder="Nome no cartão" style={styles.input} value={nomeCartao} onChangeText={setNomeCartao} placeholderTextColor="#fff" />
          <TextInput placeholder="Validade (MM/AA)" style={styles.input} value={validadeCartao} onChangeText={setValidadeCartao} placeholderTextColor="#fff" />
          <TextInput placeholder="CVV" style={styles.input} value={cvvCartao} onChangeText={setCvvCartao} placeholderTextColor="#fff" keyboardType="numeric" secureTextEntry />
          <TouchableOpacity style={styles.payButton} onPress={handleCartaoPagamento}>
            <Text style={styles.payButtonText}>Confirmar Pagamento</Text>
          </TouchableOpacity>
        </>
      )}

      {pdfUrl !== '' && (
        <TouchableOpacity style={styles.pdfButton} onPress={() => Linking.openURL(pdfUrl)}>
          <Text style={styles.pdfButtonText}>Baixar Ingresso (PDF)</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', padding: 20, alignItems: 'center' },
  title: { fontSize: 22, color: '#c57f39', marginBottom: 20 },
  label: { color: '#fff', marginBottom: 10 },
  input: { backgroundColor: '#c57f39', width: '100%', padding: 10, borderRadius: 8, color: '#fff', marginBottom: 10 },
  payButton: { backgroundColor: '#A46A32', padding: 15, borderRadius: 8, marginTop: 15 },
  payButtonText: { color: '#fff', fontWeight: 'bold' },
  resultContainer: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginTop: 20, width: '100%' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  stepperButton: { backgroundColor: '#c57f39', padding: 15, borderRadius: 50, marginHorizontal: 20 },
  stepperText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  quantityText: { fontSize: 22, color: '#fff' },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, marginBottom: 10, width: '100%' },
  paymentButton: { backgroundColor: '#333', padding: 12, borderRadius: 8, width: '45%' },
  selectedButton: { backgroundColor: '#A46A32' },
  paymentButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  pdfButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, marginTop: 20 },
  pdfButtonText: { color: '#fff', fontWeight: 'bold' }
});
