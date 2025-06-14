import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function BarraDePesquisa({ searchText, setSearchText, categoria, setCategoria }) {
  return (
    <View style={styles.container}>
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
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Todas as categorias" value="" />
        <Picker.Item label="Música" value="Música" />
        <Picker.Item label="Tecnologia" value="Tecnologia" />
        <Picker.Item label="Esporte" value="Esporte" />
        <Picker.Item label="Negócios" value="Negócios" />
        <Picker.Item label="Outros" value="Outros" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#000"
  },
  picker: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    color: "#fff"  
  },
  pickerItem: {
    color: "#fff"  
  }
});
