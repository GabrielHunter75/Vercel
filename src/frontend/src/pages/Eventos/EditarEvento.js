import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../../Register/components/header"; // Ajuste o caminho se necessário
import "../../Register/style/CriarEvento.css"; // Reutilize o CSS geral para cores de fundo, etc.
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Paper,
    TextField,
    // Removido: Select, MenuItem, FormControl, InputLabel, LinearProgress
    Checkbox,
    FormControlLabel,
    IconButton,
    LinearProgress // Mantido para o carregamento inicial dos dados do evento
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Ícone para upload
import dayjs from 'dayjs'; // Importe dayjs para formatação de data (npm install dayjs)

export default function EditarEvento() {
    const navigate = useNavigate();
    const { id } = useParams(); // Pega o ID do evento da URL para carregar e editar

    // Estados para os campos do evento
    const [titulo, setTitulo] = useState('');
    const [local, setLocal] = useState('');
    const [dataEvento, setDataEvento] = useState('');
    const [descricao, setDescricao] = useState('');
    const [faixaEtaria, setFaixaEtaria] = useState('');
    const [imagem, setImagem] = useState(null); // Pode ser URL (string) ou File
    const [imagemPreview, setImagemPreview] = useState(null); // Para mostrar a pré-visualização
    // const [categoria, setCategoria] = useState(''); // Removido
    const [privado, setPrivado] = useState(false);
    const [mensagemErro, setMensagemErro] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    // Removido: categoriasDisponiveis
    const [ingressos, setIngressos] = useState([]); // Array de objetos de ingresso

    const [loading, setLoading] = useState(true); // Para controlar o carregamento inicial dos dados do evento
    const [loadingSubmit, setLoadingSubmit] = useState(false); // Para o status de submissão do formulário

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
        } else {
            navigate('/login');
        }

        // 1. Não há mais busca de categorias, pois o campo foi removido.

        // 2. Buscar dados do evento para edição
        async function fetchEventoParaEdicao() {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/api/v1/eventos/${id}`);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar evento: ${response.statusText}`);
                }
                const data = await response.json();

                // Preencher os estados com os dados do evento
                setTitulo(data.titulo);
                setLocal(data.local);
                // Formatar a data para o input datetime-local
                setDataEvento(dayjs(data.data).format('YYYY-MM-DDTHH:mm'));
                setDescricao(data.descricao);
                setFaixaEtaria(data.faixa_etaria);

                // Lógica para imagem: se for uma URL, exibe; se for nula, define preview como nulo.
                if (data.imagem) {
                    // Verifica se é uma URL completa ou um nome de arquivo (para imagens de upload)
                    const imageUrl = data.imagem.startsWith('data:image') 
                        ? data.imagem 
                        : `http://localhost:3001/uploads/${data.imagem.split('/').pop()}`;
                    setImagem(data.imagem); // Mantenha a string original ou Base64
                    setImagemPreview(imageUrl); // Para exibir
                } else {
                    setImagem(null);
                    setImagemPreview(null);
                }
                
                // setCategoria(data.categoria?._id || ''); // Removido
                setPrivado(data.privado);

                // Carregar os ingressos existentes. Se não houver, inicia com um campo vazio.
                setIngressos(data.ingressos && data.ingressos.length > 0 ? data.ingressos : [{ nome: '', preco: '', quantidadeDisponivel: '' }]);

            } catch (error) {
                console.error('Erro ao carregar evento para edição:', error);
                setMensagemErro('Não foi possível carregar os dados do evento para edição.');
            } finally {
                setLoading(false);
            }
        }
        fetchEventoParaEdicao();

    }, [id, navigate]); // Dependências: id do evento e navigate

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
            setImagem(file); // Guarda o objeto File
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagemPreview(reader.result); // Guarda a URL para pré-visualização
            };
            reader.readAsDataURL(file);
        } else {
            setImagem(null);
            setImagemPreview(null);
        }
    };

    // Funções para gerenciar ingressos (iguais ao CriarEvento)
    const handleAddIngresso = () => {
        setIngressos([...ingressos, { nome: '', preco: '', quantidadeDisponivel: '' }]);
    };

    const handleRemoveIngresso = (index) => {
        const newIngressos = [...ingressos];
        newIngressos.splice(index, 1);
        setIngressos(newIngressos);
    };

    const handleIngressoChange = (index, field, value) => {
        const newIngressos = [...ingressos];
        newIngressos[index][field] = value;
        setIngressos(newIngressos);
    };

    async function handleSubmitEdicao(event) {
        event.preventDefault();
        setMensagemErro('');
        setLoadingSubmit(true);

        if (!currentUser) {
            setMensagemErro('Nenhum usuário logado. Por favor, faça login.');
            setLoadingSubmit(false);
            return;
        }

        let imagemParaEnviar = imagem;
        // Se a imagem no estado for um File (porque o usuário selecionou uma nova)
        if (imagem instanceof File) {
            try {
                imagemParaEnviar = await converterImagemParaBase64(imagem);
            } catch (error) {
                setMensagemErro('Erro ao converter nova imagem: ' + error.message);
                setLoadingSubmit(false);
                return;
            }
        }
        // Se imagem for null ou undefined, envia null. Se for string (URL existente), envia a string.

        // Validar ingressos
        const ingressosValidos = ingressos.filter(ing =>
            ing.nome && parseFloat(ing.preco) >= 0 && parseInt(ing.quantidadeDisponivel) >= 0
        ).map(ing => ({
            // Mantenha o _id se o ingresso já existir para o backend poder identificar
            _id: ing._id, // Se o ingresso for novo, _id será undefined e o Mongoose criará um
            nome: ing.nome,
            preco: parseFloat(ing.preco),
            quantidadeDisponivel: parseInt(ing.quantidadeDisponivel)
        }));

        if (ingressos.length > 0 && ingressosValidos.length !== ingressos.length) {
            setMensagemErro('Preencha todos os campos de ingresso corretamente (nome, preço, quantidade).');
            setLoadingSubmit(false);
            return;
        }

        const eventoAtualizado = {
            titulo,
            local,
            data: dayjs(dataEvento).toDate(), // Converte para objeto Date
            descricao,
            faixa_etaria: faixaEtaria,
            imagem: imagemParaEnviar,
            // categoria, // Removido
            organizador_id: currentUser._id, // Mantém o organizador
            privado,
            ingressos: ingressosValidos // Envia os ingressos atualizados
        };

        try {
            const response = await fetch(`http://localhost:3001/api/v1/eventos/${id}`, {
                method: 'PUT', // MÉTODO PUT
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventoAtualizado)
            });

            if (response.ok) {
                // Não usar alert(), substituir por feedback na UI.
                navigate('/meus-eventos'); // Redireciona de volta para a lista
            } else {
                const errorData = await response.json();
                setMensagemErro(`Erro ao atualizar evento: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            setMensagemErro('Erro na requisição: ' + error.message);
        } finally {
            setLoadingSubmit(false);
        }
    }

    if (loading) {
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
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px'
                        }}
                    >
                        <Typography variant="h5" sx={{ color: '#c57f39', mb: 2 }}>
                            Carregando dados do evento...
                        </Typography>
                        <LinearProgress sx={{ width: '80%', '& .MuiLinearProgress-bar': { backgroundColor: '#c57f39' } }} />
                    </Paper>
                </Container>
            </Box>
        );
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
                        backgroundColor: '#1E1E1E',
                        color: '#f5f5f5',
                        boxShadow: '0px 10px 25px rgba(0,0,0,0.5)',
                        border: '1px solid #333'
                    }}
                >
                    {/* Cabeçalho da Página */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#c57f39', mb: 1 }}>
                            Editar Evento
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#aaa' }}>
                            Altere os dados do seu evento abaixo.
                        </Typography>
                    </Box>

                    {/* Mensagem de Erro */}
                    {mensagemErro && (
                        <Typography
                            color="error"
                            sx={{
                                textAlign: 'center',
                                mb: 3,
                                p: 1.5,
                                border: '1px solid #d32f2f',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(211,47,47,0.15)',
                                fontWeight: 'medium'
                            }}
                        >
                            {mensagemErro}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmitEdicao}>
                        <Grid container spacing={3}>
                            {/* Seção 1: Informações Principais do Evento */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#c57f39', mb: 2, borderBottom: '1px solid #c57f3950', pb: 1 }}>
                                    Informações Essenciais
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Título do Evento"
                                    variant="outlined"
                                    value={titulo}
                                    onChange={e => setTitulo(e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiInputBase-input': { color: '#f5f5f5' },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#555' },
                                            '&:hover fieldset': { borderColor: '#c57f39' },
                                            '&.Mui-focused fieldset': { borderColor: '#c57f39' },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Local"
                                    variant="outlined"
                                    value={local}
                                    onChange={e => setLocal(e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiInputBase-input': { color: '#f5f5f5' },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#555' },
                                            '&:hover fieldset': { borderColor: '#c57f39' },
                                            '&.Mui-focused fieldset': { borderColor: '#c57f39' },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Data e Hora"
                                    type="datetime-local"
                                    value={dataEvento}
                                    onChange={e => setDataEvento(e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputBase-input': { color: '#f5f5f5' },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#555' },
                                            '&:hover fieldset': { borderColor: '#c57f39' },
                                            '&.Mui-focused fieldset': { borderColor: '#c57f39' },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descrição Detalhada"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                    placeholder="Descreva seu evento em detalhes, atividades e atrações."
                                    required
                                    sx={{
                                        '& .MuiInputBase-input': { color: '#f5f5f5' },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#555' },
                                            '&:hover fieldset': { borderColor: '#c57f39' },
                                            '&.Mui-focused fieldset': { borderColor: '#c57f39' },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Faixa Etária"
                                    variant="outlined"
                                    value={faixaEtaria}
                                    onChange={e => setFaixaEtaria(e.target.value)}
                                    placeholder="Ex.: Livre, 18+, 16+"
                                    required
                                    sx={{
                                        '& .MuiInputBase-input': { color: '#f5f5f5' },
                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#555' },
                                            '&:hover fieldset': { borderColor: '#c57f39' },
                                            '&.Mui-focused fieldset': { borderColor: '#c57f39' },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Seção 2: Imagem do Evento */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#c57f39', mt: 3, mb: 2, borderBottom: '1px solid #c57f3950', pb: 1 }}>
                                    Imagem Principal do Evento
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2,
                                        backgroundColor: '#2a2a2a',
                                        borderColor: '#555',
                                        borderRadius: '12px',
                                        minHeight: '200px',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {imagemPreview ? (
                                        <Box sx={{ maxWidth: '100%', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px' }}>
                                            <img src={imagemPreview} alt="Pré-visualização da Imagem" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
                                        </Box>
                                    ) : (
                                        <CloudUploadIcon sx={{ fontSize: 70, color: '#aaa' }} />
                                    )}
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{
                                            backgroundColor: '#c57f39',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#a86a2f' },
                                            borderRadius: '8px',
                                            px: 4, py: 1.5,
                                            fontWeight: 'bold',
                                            boxShadow: '0px 4px 10px rgba(197,127,57,0.3)'
                                        }}
                                    >
                                        {imagemPreview ? 'Mudar Imagem' : 'Escolher Imagem'}
                                        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                                    </Button>
                                    {imagemPreview && (
                                        <Typography variant="caption" sx={{ color: '#aaa' }}>
                                            {imagem instanceof File ? imagem.name : 'Imagem atual'}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" sx={{ color: '#888', textAlign: 'center', mt: 1 }}>
                                        Formatos suportados: JPG, PNG. Tamanho máximo: 5MB.
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* Seção 3: Detalhes dos Ingressos */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#c57f39', mt: 3, mb: 2, borderBottom: '1px solid #c57f3950', pb: 1 }}>
                                    Configuração de Ingressos
                                </Typography>
                            </Grid>
                            {ingressos.map((ingresso, index) => (
                                <Grid item xs={12} key={ingresso._id || index}> {/* Use ingresso._id para keys se existir */}
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 2,
                                            backgroundColor: '#2a2a2a',
                                            borderColor: '#444',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: 2,
                                            alignItems: { xs: 'stretch', sm: 'center' },
                                            mb: 1.5
                                        }}
                                    >
                                        <TextField
                                            label="Nome do Ingresso"
                                            variant="outlined"
                                            value={ingresso.nome}
                                            onChange={(e) => handleIngressoChange(index, 'nome', e.target.value)}
                                            required
                                            size="small"
                                            sx={{ flexGrow: 1, '& .MuiInputBase-input': { color: '#f5f5f5' }, '& .MuiInputLabel-root': { color: '#aaa' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#c57f39' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }}}}
                                        />
                                        <TextField
                                            label="Preço (R$)"
                                            type="number"
                                            variant="outlined"
                                            value={ingresso.preco}
                                            onChange={(e) => handleIngressoChange(index, 'preco', e.target.value)}
                                            step="0.01"
                                            min="0"
                                            required
                                            size="small"
                                            sx={{ width: { xs: '100%', sm: '120px' }, '& .MuiInputBase-input': { color: '#f5f5f5' }, '& .MuiInputLabel-root': { color: '#aaa' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#c57f39' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }}}}
                                        />
                                        <TextField
                                            label="Quantidade"
                                            type="number"
                                            variant="outlined"
                                            value={ingresso.quantidadeDisponivel}
                                            onChange={(e) => handleIngressoChange(index, 'quantidadeDisponivel', e.target.value)}
                                            min="0"
                                            required
                                            size="small"
                                            sx={{ width: { xs: '100%', sm: '120px' }, '& .MuiInputBase-input': { color: '#f5f5f5' }, '& .MuiInputLabel-root': { color: '#aaa' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#c57f39' }, '&.Mui-focused fieldset': { borderColor: '#c57f39' }}}}
                                        />
                                        {ingressos.length > 1 && (
                                            <IconButton
                                                onClick={() => handleRemoveIngresso(index)}
                                                color="error"
                                                sx={{ mt: { xs: 1, sm: 0 }, alignSelf: { xs: 'flex-end', sm: 'center' } }}
                                                aria-label="Remover Ingresso"
                                            >
                                                <RemoveCircleOutlineIcon />
                                            </IconButton>
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleAddIngresso}
                                    startIcon={<AddCircleOutlineIcon />}
                                    sx={{
                                        borderColor: '#00b050',
                                        color: '#00b050',
                                        '&:hover': { backgroundColor: 'rgba(0,176,80,0.1)', borderColor: '#009c44' },
                                        borderRadius: '8px',
                                        py: 1.5, fontWeight: 'bold'
                                    }}
                                >
                                    Adicionar Outro Ingresso
                                </Button>
                            </Grid>

                            {/* Seção 4: Opções Adicionais */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#c57f39', mt: 3, mb: 1, borderBottom: '1px solid #c57f3950', pb: 1 }}>
                                    Configurações de Privacidade
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={privado}
                                            onChange={e => setPrivado(e.target.checked)}
                                            sx={{ color: '#c57f39', '&.Mui-checked': { color: '#c57f39' } }}
                                        />
                                    }
                                    label={<Typography sx={{ color: '#f5f5f5' }}>Tornar este evento privado?</Typography>}
                                />
                                <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 0.5 }}>
                                    Eventos privados não serão visíveis publicamente.
                                </Typography>
                            </Grid>

                            {/* Botão de Submissão */}
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loadingSubmit} // Desabilita o botão enquanto o formulário está sendo enviado
                                    sx={{
                                        backgroundColor: '#00aaff',
                                        color: '#fff',
                                        py: 1.5,
                                        borderRadius: '8px',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        '&:hover': { backgroundColor: '#008ecc' },
                                        boxShadow: '0px 4px 15px rgba(0,170,255,0.3)'
                                    }}
                                >
                                    {loadingSubmit ? 'Salvando Alterações...' : 'Salvar Alterações'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}
