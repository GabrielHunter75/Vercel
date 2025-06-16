import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../Register/components/header";
import "../style/CriarEvento.css";
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Paper,
    TextField,
    Checkbox,
    FormControlLabel,
    IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dayjs from 'dayjs';

export default function CriarEvento() {
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [local, setLocal] = useState('');
    const [dataEvento, setDataEvento] = useState('');
    const [descricao, setDescricao] = useState('');
    const [faixaEtaria, setFaixaEtaria] = useState('');
    const [imagem, setImagem] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null);
    const [privado, setPrivado] = useState(false);
    // Alteração 1: Inicializa preco e quantidadeDisponivel como números
    const [ingressos, setIngressos] = useState([{ nome: '', preco: 0, quantidadeDisponivel: 0 }]);

    const [mensagemErro, setMensagemErro] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    async function converterImagemParaBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagemPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagem(null);
            setImagemPreview(null);
        }
    };

    const handleAddIngresso = () => {
        // Alteração 2: Adiciona novos ingressos com preco e quantidadeDisponivel como 0
        setIngressos([...ingressos, { nome: '', preco: 0, quantidadeDisponivel: 0 }]);
    };

    const handleRemoveIngresso = (index) => {
        const newIngressos = [...ingressos];
        newIngressos.splice(index, 1);
        setIngressos(newIngressos);
    };

    const handleIngressoChange = (index, field, value) => {
        const newIngressos = [...ingressos];
        // Alteração 3: Converte preco e quantidadeDisponivel para número imediatamente
        if (field === 'preco') {
            newIngressos[index][field] = parseFloat(value) || 0; // Se NaN, define como 0
        } else if (field === 'quantidadeDisponivel') {
            newIngressos[index][field] = parseInt(value) || 0; // Se NaN, define como 0
        } else {
            newIngressos[index][field] = value;
        }
        setIngressos(newIngressos);
    };

    async function handleSubmitEvento(event) {
        event.preventDefault();
        setMensagemErro('');
        setLoadingSubmit(true);

        if (!currentUser) {
            setMensagemErro('Nenhum usuário logado. Por favor, faça login.');
            setLoadingSubmit(false);
            return;
        }

        let imagemBase64 = null;
        if (imagem) {
            try {
                imagemBase64 = await converterImagemParaBase64(imagem);
            } catch (error) {
                setMensagemErro('Erro ao converter imagem: ' + error.message);
                setLoadingSubmit(false);
                return;
            }
        }

        // Alteração 4: Melhor validação dos ingressos
        const ingressosValidos = ingressos.map(ing => {
            const precoParsed = parseFloat(ing.preco);
            const quantidadeParsed = parseInt(ing.quantidadeDisponivel);

            if (!ing.nome || isNaN(precoParsed) || precoParsed < 0 || isNaN(quantidadeParsed) || quantidadeParsed < 0) {
                setMensagemErro('Preencha todos os campos de ingresso corretamente (nome, preço e quantidade devem ser números válidos e não negativos).');
                setLoadingSubmit(false);
                throw new Error('Dados de ingresso inválidos.'); // Lança erro para interromper a execução
            }
            return {
                ...ing,
                preco: precoParsed,
                quantidadeDisponivel: quantidadeParsed
            };
        });

        // Captura o erro lançado pela validação dos ingressos
        try {
            const finalIngressos = ingressosValidos; // Apenas para que a linha acima seja executada
        } catch (error) {
            return; // Sai da função se houver erro de validação
        }

        const novoEvento = {
            titulo,
            local,
            data: dayjs(dataEvento).toDate(),
            descricao,
            faixa_etaria: faixaEtaria,
            imagem: imagemBase64,
            organizador_id: currentUser._id,
            participantes: [],
            privado,
            ingressos: ingressosValidos // Já estão validados e formatados como números
        };

        try {
            const response = await fetch('http://localhost:3000/api/v1/eventos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoEvento)
            });

            if (response.ok) {
                navigate('/confirmacaoevento');
            } else {
                const errorData = await response.json();
                setMensagemErro(`Erro ao criar evento: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            setMensagemErro('Erro na requisição: ' + error.message);
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, flexGrow: 1 }}>
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 2, md: 4 },
                        borderRadius: '16px',
                        backgroundColor: '#1e1e1e', // Alterado de '#1' para '#1e1e1e' - possivelmente um erro de digitação no original
                    }}
                >
                    <Typography variant="h4" sx={{ color: '#fff', mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                        Criar Novo Evento
                    </Typography>

                    <form onSubmit={handleSubmitEvento}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Título do Evento"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }, },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Local"
                                    value={local}
                                    onChange={(e) => setLocal(e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }, },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Data e Hora"
                                    type="datetime-local"
                                    value={dataEvento}
                                    onChange={(e) => setDataEvento(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }, },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descrição do Evento"
                                    multiline
                                    rows={4}
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }, },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Faixa Etária"
                                    value={faixaEtaria}
                                    onChange={(e) => setFaixaEtaria(e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }, },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{
                                        borderColor: '#c57f39',
                                        color: '#c57f39',
                                        '&:hover': {
                                            borderColor: '#a86a2f',
                                            backgroundColor: 'rgba(197,127,57,0.1)'
                                        },
                                        width: '100%',
                                        py: 1.5,
                                        borderRadius: '8px'
                                    }}
                                >
                                    Upload Imagem do Evento
                                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                </Button>
                                {imagemPreview && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <img src={imagemPreview} alt="Pré-visualização da Imagem" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #333' }} />
                                    </Box>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={privado}
                                            onChange={(e) => setPrivado(e.target.checked)}
                                            sx={{
                                                color: '#c57f39',
                                                '&.Mui-checked': { color: '#c57f39' },
                                            }}
                                        />
                                    }
                                    label={<Typography sx={{ color: '#fff' }}>Evento Privado</Typography>}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 'bold' }}>
                                    Ingressos
                                </Typography>
                                {ingressos.map((ingresso, index) => (
                                    <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: '#2a2a2a', borderRadius: '8px', border: '1px solid #333' }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Nome do Ingresso"
                                                    value={ingresso.nome}
                                                    onChange={(e) => handleIngressoChange(index, 'nome', e.target.value)}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }, },
                                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Preço"
                                                    type="number" // Alteração 5: Tipo numérico
                                                    value={ingresso.preco}
                                                    onChange={(e) => handleIngressoChange(index, 'preco', e.target.value)}
                                                    required
                                                    inputProps={{ step: "0.01", min: "0" }} // Permite casas decimais e mínimo 0
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }, },
                                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Quantidade Disponível"
                                                    type="number" // Alteração 6: Tipo numérico
                                                    value={ingresso.quantidadeDisponivel}
                                                    onChange={(e) => handleIngressoChange(index, 'quantidadeDisponivel', e.target.value)}
                                                    required
                                                    inputProps={{ min: "0" }} // Mínimo 0
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }, },
                                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#c57f39' },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <IconButton
                                                    onClick={() => handleRemoveIngresso(index)}
                                                    color="error"
                                                    disabled={ingressos.length === 1} // Desabilita se for o último ingresso
                                                >
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                                <Button
                                    variant="text"
                                    onClick={handleAddIngresso}
                                    startIcon={<AddCircleOutlineIcon />}
                                    sx={{ color: '#00aaff', fontWeight: 'bold', mt: 1 }}
                                >
                                    Adicionar Ingresso
                                </Button>
                            </Grid>

                            {mensagemErro && (
                                <Grid item xs={12}>
                                    <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                                        {mensagemErro}
                                    </Typography>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loadingSubmit}
                                    sx={{
                                        backgroundColor: '#c57f39',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        borderRadius: '8px',
                                        mt: 3,
                                        '&:hover': {
                                            backgroundColor: '#a86a2f',
                                        },
                                        boxShadow: '0px 4px 10px rgba(197,127,57,0.3)'
                                    }}
                                >
                                    {loadingSubmit ? 'Criando Evento...' : 'Criar Evento'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}