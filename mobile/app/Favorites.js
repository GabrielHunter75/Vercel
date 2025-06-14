import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function Favoritos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    buscarFavoritos();
  }, []);

  const buscarFavoritos = async () => {
    try {
      const favoritosStorage = await AsyncStorage.getItem("favoritos");
      const favoritosIds = favoritosStorage
        ? Object.keys(JSON.parse(favoritosStorage)).filter(
            (id) => JSON.parse(favoritosStorage)[id]
          )
        : [];

      const promises = favoritosIds.map((id) => api.get(`/eventos/${id}`));
      const resultados = await Promise.all(promises);
      setEventos(resultados.map((res) => res.data));
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const removerFavorito = async (eventoId) => {
    try {
      const favoritosStorage = await AsyncStorage.getItem("favoritos");
      let favoritos = favoritosStorage ? JSON.parse(favoritosStorage) : {};
      favoritos[eventoId] = false;
      await AsyncStorage.setItem("favoritos", JSON.stringify(favoritos));

      setEventos((prev) => prev.filter((evento) => evento._id !== eventoId));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover dos favoritos");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c57f39" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Favoritos</Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.titulo}</Text>
            {item.imagem ? (
              <Image source={{ uri: item.imagem }} style={styles.eventImage} />
            ) : (
              <View style={styles.noImage}>
                <Text style={{ color: "#aaa" }}>Sem imagem</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removerFavorito(item._id)}
            >
              <AntDesign name="delete" size={22} color="#fff" />
              <Text style={styles.removeButtonText}>Remover dos favoritos</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum evento favoritado ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  eventImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },
  noImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  removeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#c57f39",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  emptyText: { color: "#fff", textAlign: "center", marginTop: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});
