// src/pages/IngressosPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';

const ingressosFalsos = [
  {
    id: 1,
    nome: 'Lote Extra | Open Bar',
    preco: 645,
    taxa: 83.85,
  },
  {
    id: 2,
    nome: 'Lote Extra | Inteira | [Front Stage]',
    preco: 600,
    taxa: 78,
  },
  {
    id: 3,
    nome: 'Lote Extra | Meia Entrada | [Front Stage]',
    preco: 300,
    taxa: 39,
  },
  {
    id: 4,
    nome: 'Lote Extra | Solidário | [Front Stage]',
    preco: 330,
    taxa: 42.9,
  },
];

const IngressosPage = () => {
  const [quantidades, setQuantidades] = useState({});

  const handleQuantidade = (id, op) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + op),
    }));
  };

  return (
    <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, backgroundColor: '#1e1e1e', borderRadius: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
            Ingressos
          </Typography>

          {ingressosFalsos.map((ingresso) => {
            const total = ingresso.preco + ingresso.taxa;
            return (
              <Box
                key={ingresso.id}
                sx={{
                  backgroundColor: '#2a2a2a',
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                  {ingresso.nome}
                </Typography>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                  R$ {ingresso.preco.toFixed(2)} (+ R$ {ingresso.taxa.toFixed(2)} taxa)
                </Typography>
                <Typography sx={{ color: '#4caf50', fontSize: '0.85rem' }}>
                  em até 12x R$ {(total / 12).toFixed(2).replace('.', ',')}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                  Vendas até 21h00
                </Typography>

                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 32, color: '#ccc', borderColor: '#ccc' }}
                    onClick={() => handleQuantidade(ingresso.id, -1)}
                  >
                    −
                  </Button>
                  <Typography sx={{ color: '#fff' }}>
                    {quantidades[ingresso.id] || 0}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ minWidth: 32, backgroundColor: '#00aaff', '&:hover': { backgroundColor: '#008ecc' } }}
                    onClick={() => handleQuantidade(ingresso.id, 1)}
                  >
                    +
                  </Button>
                </Box>
              </Box>
            );
          })}

          <Button
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#00b050',
              color: '#fff',
              fontWeight: 'bold',
              paddingY: 1.2,
              '&:hover': {
                backgroundColor: '#009c44',
              },
            }}
          >
            Confirmar Ingressos
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default IngressosPage;
