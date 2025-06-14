import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#000', // Cor de fundo da tela
    paddingHorizontal: 20,
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4', // Azul do Google
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop:60,
    marginBottom: 30,
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    top:50
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },

  text: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop:60,
  },

  link: {
    color: '#ffffff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 24,
},

backButtonText: {
  color: '#c57f39',
  fontSize: 16,
  marginLeft: 8,
  top:50
},

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },


});

export default styles;
