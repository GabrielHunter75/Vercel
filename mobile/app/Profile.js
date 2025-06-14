import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function MinhaConta() {
  const [userData, setUserData] = useState(null);
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

  const handleEdit = () => {
    router.push('/EditProfile');
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
    <View style={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>

      {/* Imagem de perfil */}
      <View style={styles.profileImageContainer}>
        {userData.profileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.placeholderText}>Sem Foto</Text>
          </View>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{userData.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>

        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.value}>{userData.cpf}</Text>

        <Text style={styles.label}>CEP:</Text>
        <Text style={styles.value}>{userData.cep}</Text>

        <Text style={styles.label}>Cidade:</Text>
        <Text style={styles.value}>{userData.cidade}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{userData.estado}</Text>

        {userData.cnpj ? (
          <>
            <Text style={styles.label}>CNPJ:</Text>
            <Text style={styles.value}>{userData.cnpj}</Text>
          </>
        ) : null}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Editar Dados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#c57f39',
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
  },
  label: {
    color: '#c57f39',
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#c57f39',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 15,
    backgroundColor: '#c57f39',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});
