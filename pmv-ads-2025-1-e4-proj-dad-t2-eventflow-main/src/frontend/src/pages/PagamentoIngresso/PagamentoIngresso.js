import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Register/components/header';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { CreditCard, Pix, CheckCircleOutline, ErrorOutline } from '@mui/icons-material';

dayjs.locale('pt-br');

const PagamentoIngresso = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { evento, ingressosSelecionados } = location.state || {};

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Estados para os campos do cartão de crédito
    const [cardNumber, setCardNumber] = useState('');
    const [cardValidity, setCardValidity] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [cardName, setCardName] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
        }

        if (!evento || !ingressosSelecionados || !Array.isArray(ingressosSelecionados) || ingressosSelecionados.length === 0) {
            console.error('Dados de evento ou ingressos inválidos na página de pagamento. Redirecionando para a página inicial.');
            setTimeout(() => navigate('/'), 2000);
        } else {
            ingressosSelecionados.forEach((ing, index) => {
                if (typeof ing.preco !== 'number' || isNaN(ing.preco)) {
                    console.warn(`Aviso: Ingresso ${ing.nome} (índice ${index}) tem 'preco' não numérico ou NaN:`, ing.preco);
                }
                if (ing.taxa !== undefined && (typeof ing.taxa !== 'number' || isNaN(ing.taxa))) {
                    console.warn(`Aviso: Ingresso ${ing.nome} (índice ${index}) tem 'taxa' não numérico ou NaN:`, ing.taxa);
                }
                if (typeof ing.quantidade !== 'number' || isNaN(ing.quantidade)) {
                    console.warn(`Aviso: Ingresso ${ing.nome} (índice ${index}) tem 'quantidade' não numérico ou NaN:`, ing.quantidade);
                }
            });
        }
    }, [evento, ingressosSelecionados, navigate]);

    const { subtotalIngressos, taxaServicoTotal, valorTotal } = useMemo(() => {
        const calculatedSubtotal = (ingressosSelecionados && Array.isArray(ingressosSelecionados)) ?
            ingressosSelecionados.reduce((acc, ingresso) => {
                const preco = typeof ingresso.preco === 'number' && !isNaN(ingresso.preco) ? ingresso.preco : 0;
                const taxa = typeof ingresso.taxa === 'number' && !isNaN(ingresso.taxa) ? ingresso.taxa : 0;
                const quantidade = typeof ingresso.quantidade === 'number' && !isNaN(ingresso.quantidade) ? ingresso.quantidade : 0;
                return acc + (preco + taxa) * quantidade;
            }, 0) : 0;

        const calculatedTaxaServicoTotal = (ingressosSelecionados && Array.isArray(ingressosSelecionados)) ?
            ingressosSelecionados.reduce((acc, ingresso) => {
                const taxa = typeof ingresso.taxa === 'number' && !isNaN(ingresso.taxa) ? ingresso.taxa : 0;
                const quantidade = typeof ingresso.quantidade === 'number' && !isNaN(ingresso.quantidade) ? ingresso.quantidade : 0;
                return acc + taxa * quantidade;
            }, 0) : 0;

        return {
            subtotalIngressos: calculatedSubtotal,
            taxaServicoTotal: calculatedTaxaServicoTotal,
            valorTotal: calculatedSubtotal
        };
    }, [ingressosSelecionados]);

    const handleProcessPayment = async () => {
        if (!selectedPaymentMethod) {
            setPaymentStatus('no_method_selected');
            return;
        }

        if (!currentUser) {
            setPaymentStatus('not_logged_in');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        // Validação específica para cartão de crédito
        if (selectedPaymentMethod === 'creditCard') {
            // Remove espaços em branco do número do cartão para validação
            const cleanCardNumber = cardNumber.replace(/\s/g, '');

            if (!cleanCardNumber || !cardValidity || !cardCVV || !cardName) {
                setPaymentStatus('missing_card_details');
                return;
            }

            // Validação: Número do Cartão deve ter EXATAMENTE 8 dígitos e ser numérico
            if (!/^\d{8}$/.test(cleanCardNumber)) {
                setPaymentStatus('invalid_card_number');
                return;
            }

            // Validação: Validade (MM/AA)
            if (!/^\d{2}\/\d{2}$/.test(cardValidity)) {
                setPaymentStatus('invalid_card_validity');
                return;
            }

            // Validação: CVV deve ter EXATAMENTE 3 dígitos e ser numérico
            if (!/^\d{3}$/.test(cardCVV)) {
                setPaymentStatus('invalid_card_cvv');
                return;
            }

            // Validação: Nome no Cartão não pode estar vazio
            if (cardName.trim() === '') {
                setPaymentStatus('invalid_card_name'); // Novo status para nome inválido
                return;
            }
        }

        setIsLoading(true);
        setPaymentStatus(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

           const success = Math.random() > 0.01; // 99% de chance de sucesso

            if (success) {
                setPaymentStatus('success');
                setTimeout(() => {
                    navigate('/meus-ingressos', { state: { compraConfirmada: true, evento, ingressosSelecionados } });
                }, 1500);
            } else {
                setPaymentStatus('error');
            }
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            setPaymentStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!evento || !ingressosSelecionados || !Array.isArray(ingressosSelecionados) || ingressosSelecionados.length === 0) {
        return (
            <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <CircularProgress color="inherit" size={30} sx={{ mr: 2 }} />
                <Typography variant="h6">Carregando detalhes da compra ou dados inválidos. Redirecionando...</Typography>
            </Box>
        );
    }

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#555' },
            '&:hover fieldset': { borderColor: '#888' },
            '&.Mui-focused fieldset': { borderColor: '#00aaff' },
            color: '#fff',
        },
        '& .MuiInputLabel-root': { color: '#aaa' },
        margin: 'normal',
    };

    return (
        <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <Container maxWidth="md" sx={{ pt: 4, pb: 6, flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#f5f5f5', fontWeight: 'bold', mb: 3 }}>
                    Finalizar Compra
                </Typography>

                <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1e1e1e', mb: 4 }}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ color: '#f5f5f5', mb: 2, fontWeight: 'bold' }}>
                            Resumo do Pedido
                        </Typography>
                        <Divider sx={{ mb: 2, borderColor: '#333' }} />

                        <Grid container spacing={2} alignItems="center" mb={2}>
                            <Grid item xs={4} sm={3}>
                                <Box sx={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '8px' }}>
                                    <img
                                        src={evento.imagem || '/placeholder.jpg'}
                                        alt={evento.titulo}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={8} sm={9}>
                                <Typography variant="h6" sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>
                                    {evento.titulo}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                                    {evento.local}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#aaa' }}>
                                    {dayjs(evento.data).format('DD [de] MMMM [de]YYYY [às] HH:mm')}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2, borderColor: '#333' }} />

                        <List disablePadding>
                            {ingressosSelecionados.map((ingresso) => (
                                <ListItem key={ingresso.id} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                                    <ListItemText
                                        primary={
                                            <Typography sx={{ color: '#fff', fontWeight: 'medium' }}>
                                                {ingresso.nome} ({typeof ingresso.quantidade === 'number' ? ingresso.quantidade : 0})
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography sx={{ color: '#aaa', fontSize: '0.85rem' }}>
                                                Unitário: R$ {(typeof ingresso.preco === 'number' && !isNaN(ingresso.preco) ? ingresso.preco : 0).toFixed(2)} {ingresso.taxa !== undefined && typeof ingresso.taxa === 'number' && !isNaN(ingresso.taxa) ? `(+ R$ ${ingresso.taxa.toFixed(2)} taxa)` : ''}
                                            </Typography>
                                        }
                                    />
                                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                        R$ {(((typeof ingresso.preco === 'number' && !isNaN(ingresso.preco) ? ingresso.preco : 0) + (typeof ingresso.taxa === 'number' && !isNaN(ingresso.taxa) ? ingresso.taxa : 0)) * (typeof ingresso.quantidade === 'number' && !isNaN(ingresso.quantidade) ? ingresso.quantidade : 0)).toFixed(2)}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>

                        <Divider sx={{ my: 2, borderColor: '#333' }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: '#ccc' }}>Subtotal:</Typography>
                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>R$ {subtotalIngressos.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: '#ccc' }}>Taxa de Serviço:</Typography>
                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>R$ {taxaServicoTotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h6" sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>
                                Total a Pagar:
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#00b050', fontWeight: 'bold' }}>
                                R$ {valorTotal.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1e1e1e', p: 3, mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#f5f5f5', mb: 2, fontWeight: 'bold' }}>
                        Forma de Pagamento
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: '#333' }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<Pix />}
                                onClick={() => setSelectedPaymentMethod('pix')}
                                sx={{
                                    py: 1.5,
                                    borderRadius: '8px',
                                    borderColor: selectedPaymentMethod === 'pix' ? '#00b050' : '#555',
                                    color: selectedPaymentMethod === 'pix' ? '#00b050' : '#fff',
                                    backgroundColor: selectedPaymentMethod === 'pix' ? 'rgba(0, 176, 80, 0.1)' : 'transparent',
                                    '&:hover': {
                                        borderColor: '#00b050',
                                        backgroundColor: 'rgba(0, 176, 80, 0.05)',
                                    },
                                }}
                            >
                                Pagar com PIX
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<CreditCard />}
                                onClick={() => setSelectedPaymentMethod('creditCard')}
                                sx={{
                                    py: 1.5,
                                    borderRadius: '8px',
                                    borderColor: selectedPaymentMethod === 'creditCard' ? '#00aaff' : '#555',
                                    color: selectedPaymentMethod === 'creditCard' ? '#00aaff' : '#fff',
                                    backgroundColor: selectedPaymentMethod === 'creditCard' ? 'rgba(0, 170, 255, 0.1)' : 'transparent',
                                    '&:hover': {
                                        borderColor: '#00aaff',
                                        backgroundColor: 'rgba(0, 170, 255, 0.05)',
                                    },
                                }}
                            >
                                Pagar com Cartão de Crédito
                            </Button>
                        </Grid>
                    </Grid>

                    {selectedPaymentMethod === 'creditCard' && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" sx={{ color: '#f5f5f5', mb: 2 }}>
                                Detalhes do Cartão de Crédito
                            </Typography>
                            <TextField
                                fullWidth
                                label="Número do Cartão (8 dígitos)"
                                variant="outlined"
                                value={cardNumber}
                                onChange={(e) => {
                                    // Permite apenas dígitos e limita a 8 caracteres no input
                                    const value = e.target.value.replace(/\D/g, '').substring(0, 8);
                                    setCardNumber(value);
                                }}
                                inputProps={{ maxLength: 8 }} // Limita o input visualmente também
                                sx={textFieldStyles}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Validade (MM/AA)"
                                        variant="outlined"
                                        value={cardValidity}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
                                            if (value.length > 2) {
                                                value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                            }
                                            setCardValidity(value.substring(0, 5)); // Limita a 5 caracteres (MM/AA)
                                        }}
                                        inputProps={{ maxLength: 5 }} // Limita o input visualmente
                                        sx={textFieldStyles}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="CVV (3 dígitos)"
                                        variant="outlined"
                                        value={cardCVV}
                                        onChange={(e) => {
                                            // Permite apenas dígitos e limita a 3 caracteres no input
                                            const value = e.target.value.replace(/\D/g, '').substring(0, 3);
                                            setCardCVV(value);
                                        }}
                                        inputProps={{ maxLength: 3 }} // Limita o input visualmente
                                        sx={textFieldStyles}
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                fullWidth
                                label="Nome no Cartão"
                                variant="outlined"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                sx={textFieldStyles}
                            />
                        </Box>
                    )}
                </Paper>

                {paymentStatus === 'success' && (
                    <Alert icon={<CheckCircleOutline fontSize="inherit" />} severity="success" sx={{ mb: 2, backgroundColor: '#1a4a2a', color: '#fff' }}>
                        Pagamento realizado com sucesso! Seus ingressos foram enviados para seu e-mail.
                    </Alert>
                )}
                {paymentStatus === 'error' && (
                    <Alert icon={<ErrorOutline fontSize="inherit" />} severity="error" sx={{ mb: 2, backgroundColor: '#4a1a1a', color: '#fff' }}>
                        Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.
                    </Alert>
                )}
                {paymentStatus === 'no_method_selected' && (
                    <Alert icon={<ErrorOutline fontSize="inherit" />} severity="warning" sx={{ mb: 2, backgroundColor: '#4a3a1a', color: '#fff' }}>
                        Por favor, selecione uma forma de pagamento para continuar.
                    </Alert>
                )}
                 {paymentStatus === 'not_logged_in' && (
                    <Alert icon={<ErrorOutline fontSize="inherit" />} severity="info" sx={{ mb: 2, backgroundColor: '#1a3a4a', color: '#fff' }}>
                        Você precisa estar logado para finalizar a compra. Redirecionando para a página de login...
                    </Alert>
                )}
                {paymentStatus === 'missing_card_details' && (
                    <Alert icon={<ErrorOutline fontSize="inherit" />} severity="warning" sx={{ mb: 2, backgroundColor: '#4a3a1a', color: '#fff' }}>
                        Por favor, preencha todos os campos do cartão.
                    </Alert>
                )}
                {paymentStatus === 'invalid_card_number' && (
                    <Alert icon={<ErrorOutline fontSize="inherit" />} severity="warning" sx={{ mb: 2, backgroundColor: '#4a3a1a', color: '#fff' }}>
                        O número do cartão deve ter exatamente 8 dígitos.
                    </Alert>
                )}
                {paymentStatus === 'invalid_card_validity' && (
                    <Alert icon={<ErrorOutline fontSize="inherit" />} severity="warning" sx={{ mb: 2, backgroundColor: '#4a3a1a', color: '#fff' }}>
                        A validade do cartão deve estar no formato MM/AA.
                    </Alert>
                )}
                {paymentStatus === 'invalid_card_cvv' && (
                    <Alert icon={<ErrorOutline fontSize="inherit" />} severity="warning" sx={{ mb: 2, backgroundColor: '#4a3a1a', color: '#fff' }}>
                        O CVV deve ter exatamente 3 dígitos.
                    </Alert>
                )}
                {paymentStatus === 'invalid_card_name' && (
                    <Alert icon={<ErrorOutline fontSize="inherit" />} severity="warning" sx={{ mb: 2, backgroundColor: '#4a3a1a', color: '#fff' }}>
                        Por favor, insira o nome do titular do cartão.
                    </Alert>
                )}


                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        backgroundColor: '#00b050',
                        color: '#fff',
                        fontWeight: 'bold',
                        paddingY: 1.5,
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#009c44',
                        },
                        mt: 2
                    }}
                    onClick={handleProcessPayment}
                    disabled={isLoading || !selectedPaymentMethod}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Pagar Agora'}
                </Button>

                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.75rem', mt: 2, display: 'block', textAlign: 'center' }}>
                    Ao clicar em "Pagar Agora", você concorda com os <Box component="span" sx={{ textDecoration: 'underline' }}>Termos de Compra</Box> e <Box component="span" sx={{ textDecoration: 'underline' }}>Política de Privacidade</Box>
                </Typography>

            </Container>
        </Box>
    );
};

export default PagamentoIngresso;