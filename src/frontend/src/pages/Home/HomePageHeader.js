import {
    AppBar,
    Box,
    Container,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Toolbar,
    useScrollTrigger,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Ajustado o caminho para AuthContext
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Logo from '../../assets/PrincipalLogo.svg';

const HomePageHeader = ({ termoBusca, setTermoBusca }) => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/');
    };

    const initials = user && user.nome ? user.nome[0].toUpperCase() : '';

    const handleFilter = (categoria) => setTermoBusca(categoria);

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data: eventos } = useSWR(
        'http://localhost:3001/api/v1/eventos', // Confirme se esta é a URL correta para buscar todos os eventos
        fetcher
    );

    const eventosFiltrados = eventos?.filter((evento) =>
        evento.titulo.toLowerCase().includes(termoBusca.toLowerCase().trim())
    );

    const [showList, setShowList] = useState(false);

    useEffect(() => {
        if (termoBusca.trim() === '') {
            setShowList(false);
        } else {
            setShowList(true);
        }
    }, [termoBusca]);

    const handleItemClick = (titulo) => {
        setTermoBusca(titulo);
        setShowList(false);
        navigate(`/eventos?search=${encodeURIComponent(titulo)}`);
    };

    // Estilos comuns para os links de navegação que parecem botões
    const navButtonSx = {
        color: 'white',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #C28840',
        '&:hover': {
            backgroundColor: 'rgba(194, 136, 64, 0.2)',
            color: '#C28840',
            borderColor: '#C28840',
        },
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap', // Previne quebras de linha em textos curtos
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: 'rgba(30, 30, 30, 1)',
                transition: 'all 0.3s ease',
                py: trigger ? 1 : 2,
                zIndex: 1201,
            }}
        >
            <Container>
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {/* Logo */}
                    <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={Logo}
                            alt="Logo"
                            style={{
                                height: trigger ? '48px' : '80px',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    </Box>

                    {/* Barra de Pesquisa */}
                    <Box sx={{ position: 'relative', flexGrow: 1, mx: 4 }}>
                        <TextField
                            fullWidth
                            placeholder="Buscar eventos..."
                            size={trigger ? 'small' : 'medium'}
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                            InputProps={{
                                sx: {
                                    backgroundColor: '#fff',
                                    borderRadius: '30px',
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* Lista de resultados */}
                        {showList && eventosFiltrados?.length > 0 && (
                            <Paper
                                elevation={3}
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    mt: 1,
                                    zIndex: 1300,
                                    borderRadius: '10px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                }}
                            >
                                <List>
                                    {eventosFiltrados.map((evento) => (
                                        <ListItem key={evento._id} disablePadding>
                                            <ListItemButton onClick={() => handleItemClick(evento.titulo)}>
                                                <ListItemText
                                                    primary={evento.titulo}
                                                    secondary={evento.categoria}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
                        {showList && eventosFiltrados?.length === 0 && (
                            <Paper
                                elevation={3}
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    mt: 1,
                                    zIndex: 1300,
                                    borderRadius: '10px',
                                    p: 2,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Nenhum evento encontrado.
                                </Typography>
                            </Paper>
                        )}
                    </Box>

                    {/* Menu de Navegação + Avatar */}
                    {user ? (
                        <Box display="flex" alignItems="center" gap={2} sx={{ flexShrink: 0 }}>
                            <Typography
                                sx={navButtonSx} // Aplica o estilo de botão
                                onClick={() => navigate('/criar-evento')}
                            >
                                Criar Evento
                            </Typography>

                            <Typography
                                sx={navButtonSx} // Aplica o estilo de botão
                                onClick={() => navigate('/meus-eventos')}
                            >
                                MEUS EVENTOS
                            </Typography>

                            <Typography
                                sx={navButtonSx} // Aplica o estilo de botão
                                onClick={() => navigate('/meus-ingressos')}
                            >
                                Meus Ingressos
                            </Typography>

                            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                                <Avatar sx={{ bgcolor: '#C28840' }}>{initials}</Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => {
                                    handleMenuClose();
                                    navigate('/perfil');
                                }}>
                                    Perfil
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Sair</MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box display="flex" gap={2}>
                            <Typography
                                sx={{ color: 'white', cursor: 'pointer' }}
                                onClick={() => navigate('/login')}
                            >
                                Fazer Login
                            </Typography>
                            <Typography
                                sx={{ color: 'white', cursor: 'pointer' }}
                                onClick={() => navigate('/cadastro')}
                            >
                                Cadastrar
                            </Typography>
                        </Box>
                    )}
                </Toolbar>

                {/* Filtros rápidos */}
                <Box
                    display="flex"
                    justifyContent="center"
                    gap={4}
                    py={1}
                    sx={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    {['Festas e Shows', 'Stand Up Comedy', 'Esportes', 'Tecnologia'].map(
                        (categoria) => (
                            <Typography
                                key={categoria}
                                onClick={() => handleFilter(categoria)}
                                sx={{
                                    color: 'white',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#C28840' },
                                    fontSize: trigger ? '0.9rem' : '1rem',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {categoria}
                            </Typography>
                        )
                    )}
                </Box>
            </Container>
        </AppBar>
    );
};

export default HomePageHeader;