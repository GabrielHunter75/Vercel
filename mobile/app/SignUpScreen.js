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
    name: '', email: '', confirmEmail: '', password: '', confirmPassword: '',
    cpf: '', cep: '', cidade: '', estado: '', cnpj: ''
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
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <ImageUploader onImageSelected={setProfileImage} circular />
        </View>

        <View style={styles.formContainer}>
          {/* Todos os inputs iguais aqui */}
          {/* ... */}
          {/* Mesma lógica dos seus TextInputs */}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
