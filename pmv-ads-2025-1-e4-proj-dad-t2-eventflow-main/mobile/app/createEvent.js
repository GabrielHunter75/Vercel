import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import api from "../api";
import ImageUploader from "../components/AddImage/ImageUploader";
import styles from "./CreateEvent.styles";
import { formatDate, formatTime } from "../utils/utils";

export default function CreateEvent() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [image, setImage] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [ingressoType, setIngressoType] = useState("gratuito");
  const [pixKey, setPixKey] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");
  const [startTimeText, setStartTimeText] = useState("");
  const [endTimeText, setEndTimeText] = useState("");

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("category");
  const [eventAddress, setEventAddress] = useState("");
  const [eventZipCode, setEventZipCode] = useState("");
  const [eventNumber, setEventNumber] = useState("");
  const [eventNeighborhood, setEventNeighborhood] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [eventState, setEventState] = useState("");
  const [producerInfo, setProducerInfo] = useState("");

  useEffect(() => {
    setStartDateText(formatDate(startDate));
    setEndDateText(formatDate(endDate));
    setStartTimeText(formatTime(startTime));
    setEndTimeText(formatTime(endTime));
  }, []);

  useEffect(() => {
    if (params?.ticket) {
      try {
        const parsedTicket = JSON.parse(params.ticket);
        parsedTicket.preco = parseFloat(parsedTicket.preco).toFixed(2);
        setTicketData(parsedTicket);
        setIngressoType("pago");
      } catch (err) {
        console.log("Erro ao carregar ticket:", err);
      }
    }
  }, [params?.ticket]);

  const validateFields = () => {
    if (!eventName || !eventAddress || !startDateText || !startTimeText || !endDateText || !endTimeText) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return false;
    }
    if (ingressoType === "pago" && (!ticketData || !ticketData.preco || !ticketData.quantidade)) {
      Alert.alert("Falta configurar o ingresso pago.");
      return false;
    }
    return true;
  };

  const saveEvent = async () => {
    if (!validateFields()) return;

    const formattedStartDate = new Date(startDate.setHours(startTime.getHours(), startTime.getMinutes())).toISOString();
    const formattedEndDate = new Date(endDate.setHours(endTime.getHours(), endTime.getMinutes())).toISOString();

    let imageUrl = null;
    if (image) {
      const formData = new FormData();
      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append("imagem", { uri: image, name: filename, type });

      try {
        const response = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
        imageUrl = response.data.imageUrl;
      } catch {
        Alert.alert("Erro", "Falha no upload da imagem.");
        return;
      }
    }

    try {
      await api.post("/eventos", {
        titulo: eventName,
        local: eventAddress,
        data: formattedStartDate,
        data_fim: formattedEndDate,
        descricao: producerInfo,
        faixa_etaria: "18-35",
        imagem: imageUrl,
        categoria: category,
        ingresso: ingressoType === "pago" ? {
          ...ticketData,
          preco: parseFloat(ticketData.preco)
        } : null,
        chave_pix: pixKey,
        privado: false,
        participantes: [],
        organizador_id: "681de656658f5dae6a1586c5",
      });

      router.push("/confirmationEvent");
    } catch {
      Alert.alert("Erro", "Falha ao criar evento.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Nome */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Nome</Text>
          <TextInput style={styles.input} placeholder="Nome do evento" value={eventName} onChangeText={setEventName} placeholderTextColor="#fff" />
        </View>

        {/* Imagem */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Imagem do Evento</Text>
          <ImageUploader onImageSelected={setImage} />
        </View>

        {/* Ingresso */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Ingresso</Text>
          <TouchableOpacity style={[styles.optionButton, ingressoType === "pago" && styles.optionButtonSelected]} onPress={() => {
            router.push({ pathname: "/IngressoSelection", params: { ticket: ticketData ? JSON.stringify(ticketData) : "" } });
          }}>
            <Text style={styles.optionText}>Ingresso Pago</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, ingressoType === "gratuito" && styles.optionButtonSelected]} onPress={() => {
            setIngressoType("gratuito");
            setTicketData(null);
          }}>
            <Text style={styles.optionText}>Ingresso Gratuito</Text>
          </TouchableOpacity>

          {ticketData && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: "#fff" }}>Preço: R$ {ticketData.preco}</Text>
              <Text style={{ color: "#fff" }}>Quantidade: {ticketData.quantidade}</Text>
            </View>
          )}
        </View>

        {/* Data e horário */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Data e horário</Text>

          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.input}>
            <Text style={styles.datePickerText}><Icon name="event" size={20} color="black" /> {startDateText || "Data de Início"}</Text>
          </TouchableOpacity>
          {showStartDatePicker && <DateTimePicker value={startDate} mode="date" onChange={(e, d) => { if (d) { setStartDate(d); setStartDateText(formatDate(d)); } setShowStartDatePicker(false); }} />}

          <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.input}>
            <Text style={styles.datePickerText}><FontAwesome name="clock-o" size={20} color="black" /> {startTimeText || "Hora de Início"}</Text>
          </TouchableOpacity>
          {showStartTimePicker && <DateTimePicker value={startTime} mode="time" onChange={(e, t) => { if (t) { setStartTime(t); setStartTimeText(formatTime(t)); } setShowStartTimePicker(false); }} />}

          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.input}>
            <Text style={styles.datePickerText}><Icon name="event" size={20} color="black" /> {endDateText || "Data de Término"}</Text>
          </TouchableOpacity>
          {showEndDatePicker && <DateTimePicker value={endDate} mode="date" onChange={(e, d) => { if (d) { setEndDate(d); setEndDateText(formatDate(d)); } setShowEndDatePicker(false); }} />}

          <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.input}>
            <Text style={styles.datePickerText}><FontAwesome name="clock-o" size={20} color="black" /> {endTimeText || "Hora de Término"}</Text>
          </TouchableOpacity>
          {showEndTimePicker && <DateTimePicker value={endTime} mode="time" onChange={(e, t) => { if (t) { setEndTime(t); setEndTimeText(formatTime(t)); } setShowEndTimePicker(false); }} />}
        </View>

        {/* Localização */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>4. Localização</Text>
          <TextInput style={styles.input} placeholder="Endereço" value={eventAddress} onChangeText={setEventAddress} placeholderTextColor="#fff" />
          <TextInput style={styles.input} placeholder="CEP" value={eventZipCode} onChangeText={setEventZipCode} placeholderTextColor="#fff" />
          <TextInput style={styles.input} placeholder="Número" value={eventNumber} onChangeText={setEventNumber} placeholderTextColor="#fff" />
          <TextInput style={styles.input} placeholder="Bairro" value={eventNeighborhood} onChangeText={setEventNeighborhood} placeholderTextColor="#fff" />
          <TextInput style={styles.input} placeholder="Cidade" value={eventCity} onChangeText={setEventCity} placeholderTextColor="#fff" />
          <TextInput style={styles.input} placeholder="Estado" value={eventState} onChangeText={setEventState} placeholderTextColor="#fff" />
        </View>

        {/* Descrição */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>5. Descrição</Text>
          <TextInput style={[styles.input, { height: 100, textAlignVertical: "top" }]} placeholder="Detalhes" multiline value={producerInfo} onChangeText={setProducerInfo} placeholderTextColor="#fff" />
        </View>

        {/* Pix */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>6. Pix</Text>
          <TextInput style={styles.input} placeholder="Chave Pix" value={pixKey} onChangeText={setPixKey} placeholderTextColor="#fff" />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={saveEvent}>
          <Text style={styles.buttonText}>Criar Evento</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
