import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageUploader({ onImageSelected, initialImage, circular = false }) {
  const [image, setImage] = useState(initialImage || null);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Permita o acesso às imagens.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImage(asset.uri);
        onImageSelected(asset.uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleImagePicker}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={[circular ? styles.circularImage : styles.image]}
        />
      ) : (
        <View style={[circular ? styles.circularImage : styles.image, styles.placeholder]}>
          <Text style={{ color: '#fff' }}>Selecionar Imagem</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  circularImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
