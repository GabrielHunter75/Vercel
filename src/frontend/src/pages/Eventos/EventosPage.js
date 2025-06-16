import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useSWR from 'swr';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';

const fetcher = (url) => fetch(url).then((res) => res.json());

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const EventosPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const query = useQuery();

  // Pegando parâmetros da URL
  const meusEventos = query.get('meusEventos') === 'true';
  const userIdQuery = query.get('userId');

  const searchParam = query.get('search') || '';

  const [selecionados, setSelecionados] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Endpoint dinâmico baseado em filtro "meus eventos"
  // Só usa o userIdQuery se for igual ao usuário logado para evitar furos de segurança no frontend
  const endpoint =
    meusEventos && user && user._id === userIdQuery
      ? `http://localhost:3000/api/v1/meus-eventos/${user._id}` // <-- Mudei aqui
    : 'http://localhost:3000/api/v1/eventos'; //

  const { data: eventos, error, isLoading, mutate } = useSWR(endpoint, fetcher);

  const handleToggleSelecionado = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelecionarTodos = () => {
    const idsPermitidos = eventosFiltrados.map((e) => e._id);

    if (selecionados.length === idsPermitidos.length) {
      setSelecionados([]);
    } else {
      setSelecionados(idsPermitidos);
    }
  };

  const handleDeletarSelecionados = async () => {
    if (selecionados.length === 0) return;

    const confirm = window.confirm(
      `Tem certeza que deseja deletar ${selecionados.length} evento(s)?`
    );

    if (!confirm) return;

    try {
      await Promise.all(
        selecionados.map((id) =>
          fetch(`http://localhost:3001/api/v1/meus-eventos/${id}/${user._id}`, {
            method: 'DELETE',
          })
        )
      );

      setSnackbar({
        open: true,
        message: 'Evento(s) deletado(s) com sucesso!',
        severity: 'success',
      });

      setSelecionados([]);
      mutate();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro ao deletar eventos.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const podeDeletar = (evento) => evento.organizador_id === user?._id;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Erro ao carregar eventos.</Typography>
      </Box>
    );
  }

  // Filtra pelo texto de busca
  const eventosFiltrados = eventos?.filter((evento) => {
    const tituloMatch = evento.titulo.toLowerCase().includes(searchParam.toLowerCase());
    return tituloMatch;
  });

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} color="white">
        {searchParam
          ? `Resultados para "${searchParam}"`
          : meusEventos
          ? 'Meus Eventos'
          : 'Todos os Eventos'}
      </Typography>

      {/* Botões */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        {user && meusEventos && (
          <>
            <Button
              variant="contained"
              onClick={handleSelecionarTodos}
              sx={{
                backgroundColor: '#c57f39',
                color: '#121212',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#a6672e' },
              }}
            >
              {selecionados.length === eventosFiltrados.length
                ? 'Desmarcar Todos'
                : 'Selecionar Todos'}
            </Button>

            <Button
              variant="outlined"
              color="error"
              disabled={selecionados.length === 0}
              onClick={handleDeletarSelecionados}
            >
              Deletar Selecionados ({selecionados.length})
            </Button>
          </>
        )}
      </Box>

      {eventosFiltrados?.length === 0 ? (
        <Typography color="white">Nenhum evento encontrado.</Typography>
      ) : (
        <Grid container spacing={3}>
          {eventosFiltrados.map((evento) => {
            const isSelecionado = selecionados.includes(evento._id);
            return (
              <Grid item xs={12} sm={6} md={4} key={evento._id}>
                <Box position="relative">
                  {podeDeletar(evento) && meusEventos && (
                    <Checkbox
                      checked={isSelecionado}
                      onChange={() => handleToggleSelecionado(evento._id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        color: '#c57f39',
                        backgroundColor: '#1e1e1e',
                        borderRadius: '4px',
                      }}
                    />
                  )}

                  <Link
                    to={`/evento/${evento._id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card
                      sx={{
                        bgcolor: '#121212',
                        color: '#fff',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={evento.imagem || 'https://via.placeholder.com/400x200'}
                        alt={evento.titulo}
                      />
                      <CardContent>
                        <Typography variant="h6" color="white">
                          {evento.titulo}
                        </Typography>
                        <Typography variant="body2" color="gray">
                          {evento.categoria}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventosPage;
