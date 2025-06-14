import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './SignUpScreen.styles';
import MaskInput, { Masks } from 'react-native-mask-input';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageUploader from '../components/AddImage/ImageUploader';

export default function SignUpScreen() {
  const router = useRouter();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    cep: '',
    cidade: '',
    estado: '',
    cnpj: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateForm = () => {
    const { name, email, confirmEmail, password, confirmPassword, cpf, cep, cidade, estado } = formData;
    if (!name || !email || !confirmEmail || !password || !confirmPassword || !cpf || !cep || !cidade || !estado) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return false;
    }
    if (email !== confirmEmail) {
      Alert.alert('Erro', 'Os e-mails não coincidem.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await AsyncStorage.setItem('userData', JSON.stringify({ ...formData, profileImage }));
        login({ name: formData.name, profileImage });
        router.replace('/');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar os dados.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Botão Voltar */}
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        {/* Campo de Imagem */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <ImageUploader onImageSelected={setProfileImage} circular />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite o email novamente"
            keyboardType="email-address"
            value={formData.confirmEmail}
            onChangeText={(text) => handleChange('confirmEmail', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirme a senha"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />
          <MaskInput
            style={styles.input}
            placeholder="CPF"
            value={formData.cpf}
            onChangeText={(masked) => handleChange('cpf', masked)}
            mask={Masks.BRL_CPF}
            keyboardType="numeric"
          />
          <MaskInput
            style={styles.input}
            placeholder="CEP"
            value={formData.cep}
            onChangeText={(masked) => handleChange('cep', masked)}
            mask={Masks.ZIP_CODE}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={formData.cidade}
            onChangeText={(text) => handleChange('cidade', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Estado (Ex: MG, SP)"
            value={formData.estado}
            onChangeText={(text) => handleChange('estado', text)}
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>

        <Text style={styles.optionalLabel}>
          Caso seja um organizador ou patrocinador, informe seu CNPJ:
        </Text>
        <MaskInput
          style={styles.input}
          placeholder="CNPJ (opcional)"
          value={formData.cnpj}
          onChangeText={(masked) => handleChange('cnpj', masked)}
          mask={Masks.BRL_CNPJ}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
