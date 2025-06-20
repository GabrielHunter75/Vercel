import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material'; // Importa componentes Material-UI
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Ícone de sucesso

export default function ConfirmacaoEvento() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: '#121212', // Cor de fundo escura
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f5f5f5', // Cor do texto clara
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="sm">
        <CheckCircleOutlineIcon sx={{ fontSize: '6rem', color: '#00b050', mb: 2 }} /> {/* Ícone de sucesso verde */}
        <Typography variant="h4" component="h2" sx={{ color: '#f5f5f5', fontWeight: 'bold', mb: 2 }}>
          Evento Criado com Sucesso!
        </Typography>

        <Typography variant="body1" sx={{ color: '#ccc', mb: 4 }}>
          Seu evento foi registrado e está pronto para receber patrocinadores e participantes.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/Criar-Evento')}
            sx={{
              backgroundColor: '#c57f39', // Cor do botão principal
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#a86a2f',
              },
              py: 1.2,
              px: 3,
              borderRadius: '8px',
            }}
          >
            Criar outro evento
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              borderColor: '#c57f39', // Borda do botão secundário
              color: '#c57f39',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(197, 127, 57, 0.1)',
                borderColor: '#c57f39',
              },
              py: 1.2,
              px: 3,
              borderRadius: '8px',
            }}
          >
            Voltar para a Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}