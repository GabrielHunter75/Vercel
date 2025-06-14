import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  
  container: {
    flex: 1,               // ocupa toda a tela
    justifyContent: 'center', // centraliza verticalmente
    alignItems: 'center',     // centraliza horizontalmente
    backgroundColor: '#1E1E1E',  // fundo branco
    padding: 20,              // espaçamento interno das bordas
  },

  // Texto de boas-vindas principal
  text: {
    fontSize: 24,       // tamanho da fonte grande para destaque
    color: '#333',      // cor do texto cinza escuro
    fontWeight: 'bold', // texto em negrito para chamar atenção
    marginBottom: 20,   // espaço abaixo do texto
    textAlign: 'center' // centraliza o texto horizontalmente
  },

  // Texto que aparece quando o username está definido, para saudar o usuário
  welcome: {
    fontSize: 20,         // fonte um pouco menor que o texto principal
    color: '#555',        // cor cinza médio para suavizar o destaque
    marginTop: 10,        // espaço acima do texto
    fontStyle: 'italic',  // deixa o texto em itálico para diferenciar
  },

  // Estilo customizado para o botão padrão do React Native
  // OBS: Botões do React Native têm estilo próprio, pouco personalizável
 
  // Texto do botão, caso use TouchableOpacity e queira customizar o texto

});

export default styles;
