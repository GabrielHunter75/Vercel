import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons';

export default function ListarEventos() {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState({});
  const [searchText, setSearchText] = useState("");
  const [categoria, setCategoria] = useState("");
  const router = useRouter();

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        const response = await api.get("/eventos");
        setEventos(response.data);
        setFilteredEventos(response.data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    const carregarFavoritos = async () => {
      const favs = await AsyncStorage.getItem("favoritos");
      setFavoritos(favs ? JSON.parse(favs) : {});
    };

    carregarEventos();
    carregarFavoritos();
  }, []);

  useEffect(() => {
    filtrarEventos();
  }, [searchText, categoria, eventos]);

  const filtrarEventos = () => {
    let filtrados = eventos;

    if (searchText.trim() !== "") {
      filtrados = filtrados.filter((e) =>
        e.titulo.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (categoria !== "") {
      filtrados = filtrados.filter((e) => e.categoria === categoria);
    }

    setFilteredEventos(filtrados);
  };

  const toggleFavorito = async (eventoId) => {
    const novosFavoritos = { ...favoritos, [eventoId]: !favoritos[eventoId] };
    setFavoritos(novosFavoritos);
    await AsyncStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
  };

  const verDetalhes = (eventoId) => {
    router.push({ pathname: '/DetalheEvent', params: { id: eventoId } });
  };

  const patrocinarEvento = (eventoId) => {
    router.push({ pathname: "/PatrocinioEvent", params: { eventoId } });
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
      <Text style={styles.title}>Eventos Disponíveis</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar por nome..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Todas as categorias" value="" color="#fff" />
        <Picker.Item label="Música" value="Música" />
        <Picker.Item label="Tecnologia" value="Tecnologia" />
        <Picker.Item label="Esporte" value="Esporte" />
        <Picker.Item label="Negócios" value="Negócios" />
        <Picker.Item label="Outros" value="Outros" />
      </Picker>

      <FlatList
        data={filteredEventos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.eventTitle}>{item.titulo}</Text>
              <TouchableOpacity onPress={() => toggleFavorito(item._id)}>
                <AntDesign
                  name={favoritos[item._id] ? "heart" : "hearto"}
                  size={24}
                  color="#c57f39"
                />
              </TouchableOpacity>
            </View>

            {item.imagem ? (
              <Image source={{ uri: item.imagem }} style={styles.eventImage} />
            ) : (
              <View style={styles.noImage}>
                <Text style={{ color: "#aaa" }}>Sem imagem</Text>
              </View>
            )}

            <Text style={styles.eventDetails}>Local: {item.local}</Text>
            <Text style={styles.eventDetails}>
              Data: {new Date(item.data).toLocaleDateString()}
            </Text>

            <View style={styles.buttonRow}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Saiba mais"
                  color="#c57f39"
                  onPress={() => verDetalhes(item._id)}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Patrocinar"
                  color="#c57f39"
                  onPress={() => patrocinarEvento(item._id)}
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum evento disponível</Text>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Button
              title="Criar um evento"
              color="#A46A32"
              onPress={() => router.push('/createEvent')}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10, textAlign: "center" },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#000"
  },
  picker: {
    backgroundColor: "#1e1e1e",
    marginBottom: 20,
    borderRadius: 8,
    
  },
  eventCard: { backgroundColor: "#1e1e1e", padding: 15, borderRadius: 10, marginBottom: 15, alignItems: "center" },
  cardHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventImage: { width: "100%", height: 180, borderRadius: 10, marginVertical: 10 },
  noImage: { width: "100%", height: 180, borderRadius: 10, marginVertical: 10, backgroundColor: "#333", justifyContent: "center", alignItems: "center" },
  eventTitle: { fontSize: 18, fontWeight: "bold", color:"#c57f39" },
  eventDetails: { fontSize: 14, color: "#aaa", marginBottom: 5 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  buttonContainer: { flex: 1, marginHorizontal: 5 },
  footer: { marginTop: 30, padding: 10, alignItems: "center" },
  emptyText: { color: "#fff", textAlign: "center", marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
});
