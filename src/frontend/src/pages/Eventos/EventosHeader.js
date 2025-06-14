import { Box, Grid, Link, Typography } from '@mui/material';
import React from 'react';
import Logo from './../../assets/PrincipalLogo.svg';
import Home from './../../assets/Home.svg';

const EventosHeader = () => {
  return (
    <Box
      maxWidth={'2000px'}
      width={'100%'}
      sx={{ backgroundColor: 'rgba(18, 18, 18, 1)' }}
      padding={'0px 24px'}
    >
      <Grid container justifyContent={'space-between'} alignItems={'center'}>
        <Box width={'175px'}>
          <Link href="/">
            <img src={Home} alt="Logo" style={{ maxHeight: '96px' }}></img>
          </Link>
        </Box>
        <Box
          width={'175px'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Link href="/">
            <img src={Logo} alt="Logo" style={{ maxHeight: '96px' }}></img>
          </Link>
        </Box>
        <Box width={'175px'}>
          <Link href="/" sx={{ textDecoration: 'none' }}>
            <Typography color="white" fontSize={'24px'}>
              Criar um evento
            </Typography>
          </Link>
        </Box>
      </Grid>
    </Box>
  );
};

export default EventosHeader;
