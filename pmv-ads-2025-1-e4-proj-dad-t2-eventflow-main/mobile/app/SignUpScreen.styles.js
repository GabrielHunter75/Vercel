import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
   backgroundColor: '#c57f39',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#c57f39',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionalLabel: {
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 13,
    textAlign: 'center',
  },
 backButton: {
  marginTop: 50,
  alignSelf: 'flex-start',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: '#1e1e1e',
  borderRadius: 8,
   backgroundColor: '#1e1e1e',
  padding: 200,
},

backButtonText: {
  color: '#c57f39',
  fontSize: 15,
  fontWeight: 'bold',
  },

  formContainer: {
  backgroundColor: '#121212',
  borderRadius: 12,
  padding: 16,
  marginBottom: 24,
},


});
