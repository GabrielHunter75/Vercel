import React, { useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import HomePageHeader from './HomePageHeader';
import CarouselHome from './CarouselHome';
import EventosPage from '../Eventos/EventosPage';

export const HomePage = () => {
  const [termoBusca, setTermoBusca] = useState('');

  const handleTermoBusca = (value) => {
    setTermoBusca(value);
  };

  const handleFilter = (value) => {
    setTermoBusca(value);
  };

  return (
    <>
      <HomePageHeader
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        handleFilter={handleFilter}
      />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: '#121212',
          '& ul': {
            listStyle: 'none',
            margin: 0,
            padding: 0,
          },
        }}
      >
        <Box pt={8} pb={8}>
          <CarouselHome />
        </Box>

       
      </Container>

      <EventosPage termoBusca={termoBusca} />
    </>
  );
};
