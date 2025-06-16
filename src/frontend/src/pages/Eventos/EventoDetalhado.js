import React from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Container } from '@mui/material';
import useSWR from 'swr';
import EventoUnicoHeader from './EventoUnicoHeader';

const EventoDetalhado = () => {
  const { id } = useParams();
  const fetcher = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    return await response.json();
  };

  const { data: evento, error } = useSWR(
    `http://localhost:3000/api/v1/eventos/${id}`,
    fetcher,
  );

  if (error) {
    return (
      <Container sx={{ backgroundColor: '#1e1e1e', minHeight: '100vh' }}>
        <Typography color="error" variant="h6" align="center">
          Ocorreu um erro ao carregar o evento.
        </Typography>
      </Container>
    );
  }

  if (!evento) {
    return (
      <Container sx={{ backgroundColor: '#1e1e1e', minHeight: '100vh' }}>
        <CircularProgress
          sx={{ display: 'block', margin: 'auto', marginTop: '20%' }}
        />
      </Container>
    );
  }

  return <EventoUnicoHeader evento={evento} />;
};

export default EventoDetalhado;
