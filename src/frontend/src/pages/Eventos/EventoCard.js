import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Link } from 'react-router-dom';

dayjs.locale('pt-br');

const EventoCard = ({ evento }) => {
  const dataFormatada = dayjs(evento.data).format('DD MMM');
  const horaFormatada = dayjs(evento.data).format('HH[h]');

  return (
    <Link to={`/evento/${evento._id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          width: '100%',
          backgroundColor: '#1a1a1a',
          color: 'white',
          m: 1,
          height: '100%',
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={
            evento.imagem
              ? 'data:image/png;base64,' + evento.imagem
              : '/placeholder.jpg'
          }
          alt={evento.titulo}
        />
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold">
            {evento.titulo}
          </Typography>
          <Typography variant="body2" color="#c0c0c0">
            {evento.local}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#fbbf24', fontWeight: 'bold', mt: 1 }}
          >
            {dataFormatada} – {horaFormatada}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventoCard;
