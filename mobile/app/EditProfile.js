import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ImageUploader from '../components/AddImage/ImageUploader';

export default function MinhaConta() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
          setUserData(JSON.parse(data));
        } else {
          Alert.alert('Nenhum dado de usuário encontrado');
        }
      } catch (error) {
        Alert.alert('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    router.replace('/');
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setEditMode(false);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      Alert.alert('Erro ao salvar');
    }
  };

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleImageChange = (uri) => {
    setUserData({ ...userData, profileImage: uri });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c57f39" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum dado encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>

      {/* Imagem de perfil */}
      <View style={styles.profileImageContainer}>
        {editMode ? (
          <ImageUploader onImageSelected={handleImageChange} initialImage={userData.profileImage} circular />
        ) : userData.profileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.placeholderText}>Sem Foto</Text>
          </View>
        )}
      </View>

      <View style={styles.infoBox}>
        {renderField('Nome', 'name', userData, handleChange, editMode)}
        {renderField('Email', 'email', userData, handleChange, editMode)}
        {renderField('CPF', 'cpf', userData, handleChange, editMode)}
        {renderField('CEP', 'cep', userData, handleChange, editMode)}
        {renderField('Cidade', 'cidade', userData, handleChange, editMode)}
        {renderField('Estado', 'estado', userData, handleChange, editMode)}
        {renderField('CNPJ (opcional)', 'cnpj', userData, handleChange, editMode)}
      </View>

      {editMode ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
          <Text style={styles.buttonText}>Editar Dados</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Função auxiliar para renderizar campos de forma reutilizável
function renderField(label, field, userData, handleChange, editMode) {
  return (
    <>
      <Text style={styles.label}>{label}:</Text>
      {editMode ? (
        <TextInput
          style={styles.input}
          value={userData[field]}
          onChangeText={(text) => handleChange(field, text)}
        />
      ) : (
        <Text style={styles.value}>{userData[field] || '-'}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#c57f39',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#c57f39',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#A52A2A',
    padding: 15,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});
