import { Box, Typography } from '@mui/material';
import React from 'react';

const HomeItem = ({ svg, text, setTermoBusca }) => {
  const handleClick = () => {
    setTermoBusca(text);
  };

  return (
    <Box
      onClick={handleClick} // Evento de clique
      height={'20vh'}
      maxHeight={'216px'}
      minHeight={'100px'}
      width={'20vw'}
      maxWidth={'216px'}
      minWidth={'100px'}
      sx={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(212, 154, 90, 1), rgba(110, 80, 47, 1))',
        cursor: 'pointer', // Mostra que o item é clicável
      }}
      borderRadius={'8px'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={'8px'}
      justifyContent={'center'}
    >
      <Box maxWidth={'64px'} maxHeight={'64px'}>
        <img src={svg} alt="" />
      </Box>
      <Typography
        textAlign={'center'}
        fontSize={{
          xs: '1rem',
          sm: '1.25rem',
          md: '1.5rem',
        }}
        color="white"
      >
        {text}
      </Typography>
    </Box>
  );
};

export default HomeItem;
