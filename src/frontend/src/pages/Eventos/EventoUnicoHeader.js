// src/pages/Eventos/EventoDetalhes.jsx (or EventoUnico.js/EventoUnicoHeader.js, depending on your actual file name)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Day.js imports and configuration (must be at the top after React and react-router-dom)
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

// Material-UI imports (all grouped together at the top)
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Paper,
    Divider,
    IconButton,
    TextField
} from '@mui/material';

// Custom component imports (after third-party imports)
import Header from '../../Register/components/header';

// Icon imports (also grouped)
import ShareIcon from '@mui/icons-material/Share';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CreditCardIcon from '@mui/icons-material/CreditCard';

// Global configuration (can be here, right after imports)
dayjs.locale('pt-br');


const ingressosFalsos = [
    {
        id: 1,
        nome: 'Front Stage - Meia entrada [2° Lote]',
        preco: 500,
        taxa: 65.00,
        vendidoAte: '27/07/2025',
    },
    {
        id: 2,
        nome: 'Front Stage - Inteira [2° Lote]',
        preco: 600,
        taxa: 78.00,
        vendidoAte: '27/07/2025',
    },
    {
        id: 3,
        nome: 'Open Bar [1° Lote]',
        preco: 540.00,
        taxa: 70.20,
        vendidoAte: '27/07/2025',
    },
];

const EventoDetalhes = ({ evento }) => {
    const [quantidades, setQuantidades] = useState({});
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const defaultEvento = {
        titulo: 'NUMANICE | RIO DE JANEIRO [Data Extra]',
        local: 'Gramado do Riocentro, Rio de Janeiro - RJ',
        data: '2025-07-27T19:00:00',
        descricao: `Chegou a hora de se despedir da #Numanice3tour.
        Dia 27 de julho a gente vai fechar nossa turnê com chave de ouro na terra da preta!

        Mais informações em instagram.com/lugmillanumanice`,
        classificacaoEtaria: '18 anos!',
        loteInfo: 'Lote sujeito a alteração sem aviso prévio!',
        imagem: 'https://via.placeholder.com/800x450?text=Imagem+do+Evento',
        mapaImagem: '/mapa.png',
        organizador_id: '66a5a0256860d705c755c3c1',
        ingressos: ingressosFalsos,
    };

    const eventoData = evento || defaultEvento;

    if (!eventoData) {
        return (
            <Box
                sx={{
                    backgroundColor: '#121212',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                }}
            >
                <Typography variant="h6">Carregando detalhes do evento ou evento não encontrado.</Typography>
            </Box>
        );
    }

    const dataInicio = dayjs(eventoData.data).format('DD MMM');
    const horaInicio = dayjs(eventoData.data).format('HH:mm');
    const dataFim = eventoData.dataFim ? dayjs(eventoData.dataFim).format('DD MMM') : '';
    const horaFim = eventoData.dataFim ? dayjs(eventoData.dataFim).format('HH:mm') : '';

    const dataCompletaFormatada = `${dataInicio} - ${dayjs(eventoData.data).year()} ${horaInicio} ${dataFim ? `> ${dataFim} - ${horaFim}` : ''}`;

    const imagemSrc = eventoData.imagem
        ? eventoData.imagem.startsWith('data:image')
            ? eventoData.imagem
            : `${eventoData.imagem}`
        : '/placeholder.jpg';

    const ingressosDoEvento = eventoData.ingressos?.length > 0 ? eventoData.ingressos : ingressosFalsos;


    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: eventoData.titulo,
                    text: eventoData.descricao,
                    url: window.location.href,
                })
                .catch((error) => console.log('Erro no compartilhamento', error));
        } else {
            alert('Compartilhamento não suportado neste navegador. Copie o link: ' + window.location.href);
        }
    };

    const handleQuantidade = (id, op) => {
        setQuantidades((prev) => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + op),
        }));
    };

    const totalIngressosSelecionados = Object.values(quantidades).reduce((acc, curr) => acc + curr, 0);

    const handleConfirmarCompra = () => {
        if (!currentUser) {
            alert('Você precisa estar logado para realizar uma compra. Por favor, faça login ou cadastre-se.');
            navigate('/login');
            return;
        }

        const ingressosParaCompra = Object.keys(quantidades)
            .filter(id => quantidades[id] > 0)
            .map(id => {
                const ingresso = ingressosDoEvento.find(ing => String(ing.id) === String(id));
                return { ...ingresso, quantidade: quantidades[id] };
            });

        if (ingressosParaCompra.length === 0) {
            alert('Por favor, selecione pelo menos um ingresso para prosseguir.');
            return;
        }

        navigate('/pagamento-ingresso', {
            state: {
                evento: {
                    id: eventoData._id,
                    titulo: eventoData.titulo,
                    imagem: eventoData.imagem,
                    local: eventoData.local,
                    data: eventoData.data,
                },
                ingressosSelecionados: ingressosParaCompra,
            },
        });
    };

    const handlePatrocinar = () => {
        navigate(`/patrocinar/${eventoData._id || 'default_event_id'}`);
    };

    const showPatrocinarButton = currentUser && eventoData.organizador_id && currentUser._id !== eventoData.organizador_id;

    return (
        <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <Container maxWidth="lg" sx={{ pt: 2, pb: 0 }}>
                <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem' }}>
                    File com o produtor / Canceleira Momentos
                </Typography>
            </Container>

            <Container
                maxWidth="lg"
                sx={{
                    pt: 3,
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                position: 'relative',
                                backgroundColor: '#1e1e1e',
                                mb: 4
                            }}
                        >
                            <Box sx={{ position: 'relative', width: '100%', height: 'auto', maxHeight: '450px', overflow: 'hidden' }}>
                                <img
                                    src={imagemSrc}
                                    alt={`Imagem do evento ${eventoData.titulo}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        backgroundColor: '#333',
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder.jpg';
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    <IconButton sx={{ color: '#fff' }} onClick={handleShare}>
                                        <ShareIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: '#aaa', display: 'block', mb: 0.5, textTransform: 'uppercase' }}
                                >
                                    {eventoData.titulo.split('|')[0]?.trim()}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: '#f5f5f5',
                                        fontWeight: 'bold',
                                        mb: 1,
                                    }}
                                >
                                    {eventoData.titulo.split('|')[1]?.trim() || eventoData.titulo}
                                </Typography>

                                <Grid container spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                    <Grid item>
                                        <EventIcon sx={{ color: '#c57f39', fontSize: '1.2rem' }} />
                                    </Grid>
                                    <Grid item>
                                        <Typography sx={{ color: '#c57f39', fontSize: '0.9rem' }}>
                                            Evento presencial em {eventoData.local}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                    <Grid item>
                                        <CalendarTodayIcon sx={{ color: '#ccc', fontSize: '1.2rem' }} />
                                    </Grid>
                                    <Grid item>
                                        <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                                            {dataCompletaFormatada}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <Grid item>
                                        <CreditCardIcon sx={{ color: '#ccc', fontSize: '1.2rem' }} />
                                    </Grid>
                                    <Grid item>
                                        <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                                            Parcele em até 12x
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {showPatrocinarButton && (
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handlePatrocinar}
                                        sx={{
                                            backgroundColor: '#c57f39',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            py: 1,
                                            mb: 1,
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: '#a86a2f',
                                            },
                                            boxShadow: '0px 4px 10px rgba(197,127,57,0.3)'
                                        }}
                                    >
                                        PATROCINAR EVENTO
                                    </Button>
                                )}

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleShare}
                                    startIcon={<ShareIcon />}
                                    sx={{
                                        borderColor: '#c57f39',
                                        color: '#c57f39',
                                        fontWeight: 'bold',
                                        py: 1,
                                        '&:hover': {
                                            backgroundColor: 'rgba(197, 127, 57, 0.1)',
                                            borderColor: '#c57f39',
                                        },
                                    }}
                                >
                                    COMPARTILHAR
                                </Button>
                            </Box>
                        </Paper>

                        <Box sx={{ mt: 4, p: 3, backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
                            <Typography
                                variant="h6"
                                sx={{ color: '#f5f5f5', mb: 2, fontWeight: 'bold' }}
                            >
                                Descrição do evento
                            </Typography>
                            {eventoData.descricao.split('\n').map((line, index) => (
                                <Typography key={index} sx={{ color: '#ccc', lineHeight: 1.8, mb: 1 }}>
                                    {line.trim()}
                                </Typography>
                            ))}

                            <Typography sx={{ color: '#c57f39', fontWeight: 'bold', mt: 3, mb: 1 }}>
                                CLASSIFICAÇÃO ETÁRIA: {eventoData.classificacaoEtaria}
                            </Typography>
                            {eventoData.loteInfo && (
                                <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                                    {eventoData.loteInfo}
                                </Typography>
                            )}
                        </Box>

                        <Paper
                            sx={{
                                mt: 4,
                                backgroundColor: '#1e1e1e',
                                borderRadius: '12px',
                                border: '1px solid #333',
                                padding: 3,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ color: '#f5f5f5', mb: 2, fontWeight: 'bold' }}
                            >
                                Ingressos
                            </Typography>

                            {ingressosDoEvento.map((ingresso) => {
                                const total = ingresso.preco + (ingresso.taxa || 0);
                                return (
                                    <Box
                                        key={ingresso.id}
                                        sx={{
                                            backgroundColor: '#2a2a2a',
                                            borderRadius: '8px',
                                            p: 2,
                                            mb: 2,
                                            border: '1px solid #333',
                                        }}
                                    >
                                        <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                                            {ingresso.nome}
                                        </Typography>
                                        <Typography sx={{ color: '#ccc', fontSize: '0.9rem', mb: 0.5 }}>
                                            R$ {ingresso.preco.toFixed(2).replace('.', ',')} {ingresso.taxa ? `(+ R$ ${ingresso.taxa.toFixed(2).replace('.', ',')} taxa)` : ''}
                                        </Typography>
                                        <Typography sx={{ color: '#4caf50', fontSize: '0.85rem', mb: 1 }}>
                                            em até 12x R$ {(total / 12).toFixed(2).replace('.', ',')}
                                        </Typography>
                                        {ingresso.vendidoAte && (
                                            <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                                                Vendas até {ingresso.vendidoAte}
                                            </Typography>
                                        )}

                                        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ width: '60%' }}>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        minWidth: 32,
                                                        height: 32,
                                                        color: '#ccc',
                                                        borderColor: '#ccc',
                                                        borderRadius: '4px',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(204,204,204,0.1)',
                                                            borderColor: '#ccc',
                                                        }
                                                    }}
                                                    onClick={() => handleQuantidade(ingresso.id, -1)}
                                                    disabled={quantidades[ingresso.id] <= 0}
                                                >
                                                    −
                                                </Button>
                                                <Typography sx={{ color: '#fff', minWidth: '20px', textAlign: 'center' }}>
                                                    {quantidades[ingresso.id] || 0}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        minWidth: 32,
                                                        height: 32,
                                                        backgroundColor: '#00aaff',
                                                        borderRadius: '4px',
                                                        '&:hover': { backgroundColor: '#008ecc' }
                                                    }}
                                                    onClick={() => handleQuantidade(ingresso.id, 1)}
                                                >
                                                    +
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}

                            <Divider sx={{ my: 3, borderColor: '#333' }} />

                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Inserir código promocional"
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': {
                                            borderColor: '#555',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#888',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c57f39',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#aaa',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#c57f39',
                                    },
                                }}
                            />

                            <Button
                                fullWidth
                                sx={{
                                    backgroundColor: '#00b050',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    paddingY: 1.2,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        backgroundColor: '#009c44',
                                    },
                                }}
                                onClick={handleConfirmarCompra}
                                disabled={totalIngressosSelecionados === 0}
                            >
                                {totalIngressosSelecionados > 0 ? 'Confirmar Compra' : 'Selecione um Ingresso'}
                            </Button>

                            <Typography variant="caption" sx={{ color: '#888', fontSize: '0.75rem', mt: 1, display: 'block', textAlign: 'center' }}>
                                <Box component="span" sx={{ textDecoration: 'underline' }}>
                                    Ver política de privacidade e termos de compra
                                </Box>
                            </Typography>
                        </Paper>

                        <Box sx={{ mt: 4, p: 3, backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
                            <Typography
                                variant="h6"
                                sx={{ color: '#f5f5f5', mb: 2, fontWeight: 'bold' }}
                            >
                                MAPA DO EVENTO <br /> RIO DE JANEIRO
                            </Typography>
                            <img
                                src={eventoData.mapaImagem}
                                alt={`Mapa do evento ${eventoData.local}`}
                                style={{
                                    width: '100%',
                                    maxWidth: '520px',
                                    borderRadius: '12px',
                                    border: '1px solid #333',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default EventoDetalhes;