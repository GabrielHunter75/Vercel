import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Paper,
    TextField,
    Button,
    Snackbar,
    Alert,
    InputAdornment, // Para adicionar "R$" ao campo de valor
    IconButton // Para o botão de copiar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Ícone de copiar
import Header from '../../Register/components/header';
import { QRCodeSVG } from 'qrcode.react'; // Importando para gerar o QR Code SVG

const Patrocinio = () => {
    const { id } = useParams(); // Pega o ID do evento da URL
    const [eventoTitulo, setEventoTitulo] = useState('...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [valorPatrocinio, setValorPatrocinio] = useState(''); // Estado para o valor do patrocínio
    const [pixCopiaECola, setPixCopiaECola] = useState(''); // Estado para o Pix Copia e Cola
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    useEffect(() => {
        const fetchEventoTitle = async () => {
            setLoading(true);
            setError(null);
            try {
                // Busca o título do evento para exibir na página de patrocínio
                const response = await fetch(`http://localhost:3001/api/v1/eventos/${id}`);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar evento: ${response.statusText}`);
                }
                const data = await response.json();
                setEventoTitulo(data.titulo);
            } catch (err) {
                console.error("Erro ao buscar título do evento para patrocínio:", err);
                setError("Não foi possível carregar os detalhes do evento para patrocínio.");
            } finally {
                setLoading(false);
            }
        };
        fetchEventoTitle();
    }, [id]);

    const handleGeneratePix = async () => {
        if (parseFloat(valorPatrocinio) <= 0 || isNaN(parseFloat(valorPatrocinio))) {
            setSnackbarMessage('Por favor, insira um valor de patrocínio válido e maior que zero.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        // Em um cenário real, `chave`, `nome` e `cidade` viriam dos dados do organizador do evento.
        // Para esta simulação, usaremos valores fixos ou um placeholder.
        const pixData = {
            chave: 'sua_chave_pix_aqui', // Ex: 'email@exemplo.com' ou '12345678901' (CPF/CNPJ)
            nome: 'Nome do Organizador do Evento',
            cidade: 'Cidade do Evento',
            valor: parseFloat(valorPatrocinio).toFixed(2) // Garante 2 casas decimais
        };

        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/v1/gerar-pix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pixData),
            });

            if (!response.ok) {
                throw new Error(`Erro ao gerar Pix: ${response.statusText}`);
            }

            const data = await response.json();
            setPixCopiaECola(data.copiaecola);
            setSnackbarMessage('Pix gerado com sucesso!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Erro ao gerar Pix:", err);
            setError("Não foi possível gerar o Pix. Verifique os dados e tente novamente.");
            setSnackbarMessage('Erro ao gerar Pix. Tente novamente.');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPix = () => {
        if (pixCopiaECola) {
            document.execCommand('copy'); // Método para copiar para a área de transferência
            // navigator.clipboard.writeText(pixCopiaECola) // Melhor alternativa, mas pode não funcionar em todos os iframes
            //     .then(() => {
            //         setSnackbarMessage('Código Pix copiado!');
            //         setSnackbarSeverity('success');
            //         setSnackbarOpen(true);
            //     })
            //     .catch(err => {
            //         console.error('Erro ao copiar Pix:', err);
            //         setSnackbarMessage('Falha ao copiar código Pix.');
            //         setSnackbarSeverity('error');
            //         setSnackbarOpen(true);
            //     });
            // O `document.execCommand` é mais robusto em ambientes de iframe (como o Canvas).
            // Para fazê-lo funcionar com `document.execCommand`, você precisa de um campo de texto temporário
            // ou um evento de seleção no elemento que você quer copiar.
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = pixCopiaECola;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            setSnackbarMessage('Código Pix copiado!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
    };

    if (loading) {
        return (
            <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <CircularProgress sx={{ color: '#c57f39' }} />
                <Typography variant="h6" sx={{ ml: 2 }}>Carregando página de patrocínio...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 2, md: 4 },
                        borderRadius: '16px',
                        backgroundColor: '#1E1E1E',
                        color: '#f5f5f5',
                        boxShadow: '0px 10px 25px rgba(0,0,0,0.5)',
                        border: '1px solid #333',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#c57f39', mb: 2 }}>
                        Patrocinar Evento
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#aaa', mb: 3 }}>
                        Apoie o evento: <br/>
                        <Typography component="span" variant="h5" sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>
                            "{eventoTitulo}"
                        </Typography>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>
                        ID do Evento: {id}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Valor do Patrocínio (R$)"
                        variant="outlined"
                        type="number"
                        value={valorPatrocinio}
                        onChange={(e) => setValorPatrocinio(e.target.value)}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: '#555' },
                                '&:hover fieldset': { borderColor: '#888' },
                                '&.Mui-focused fieldset': { borderColor: '#c57f39' },
                            },
                            '& .MuiInputLabel-root': { color: '#aaa' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" sx={{ color: '#aaa' }}>R$</InputAdornment>,
                            inputProps: { min: 0.01, step: 0.01 }
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: '#00b050',
                            color: '#fff',
                            fontWeight: 'bold',
                            paddingY: 1.2,
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: '#009c44' },
                            mb: 3
                        }}
                        onClick={handleGeneratePix}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'GERAR PIX'}
                    </Button>

                    {pixCopiaECola && (
                        <Box sx={{ mt: 4, p: 2, backgroundColor: '#2a2a2a', borderRadius: '8px', border: '1px solid #333' }}>
                            <Typography variant="h6" sx={{ color: '#f5f5f5', mb: 2 }}>
                                Pague com Pix
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <QRCodeSVG
                                    value={pixCopiaECola}
                                    size={256}
                                    level="H"
                                    includeMargin={false}
                                    imageSettings={{
                                        src: "", // Adicione seu logo aqui se desejar (opcional)
                                        x: undefined,
                                        y: undefined,
                                        height: 24,
                                        width: 24,
                                        excavate: true,
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                                Copie e cole o código abaixo no seu aplicativo de banco:
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={pixCopiaECola}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleCopyPix} edge="end" sx={{ color: '#fff' }}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        backgroundColor: '#333',
                                        '& fieldset': { borderColor: '#555' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#aaa' },
                                }}
                            />
                        </Box>
                    )}
                </Paper>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Patrocinio;
