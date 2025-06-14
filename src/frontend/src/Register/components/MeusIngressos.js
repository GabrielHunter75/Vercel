import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, CircularProgress } from '@mui/material'; // Importar componentes do MUI
import HomePageHeader from '../../pages/Home/HomePageHeader'; // Importe o seu componente de Header
import '../style/MeusIngressos.css';

function MeusIngressos() {
    const [ingressos, setIngressos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para o termo de busca e filtro (necessário para o HomePageHeader)
    const [termoBusca, setTermoBusca] = useState('');
    const handleFilter = (value) => {
        setTermoBusca(value);
    };

    // --- IMPORTANTE: Como obter o ID do usuário logado ---
    // Substitua esta linha pela forma real como você obtém o ID do usuário logado no seu app.
    // Ex: localStorage.getItem('userId') ou de um contexto de autenticação.
    // Para teste, use um ID de usuário que já existe no seu banco de dados.
    const userId = '666191b2c4e36611f71a073e'; // <--- SUBSTITUA ESTE ID pelo ID do usuário logado REAL!

    useEffect(() => {
        const fetchIngressos = async () => {
            if (!userId) {
                setError("ID do usuário não disponível. Por favor, faça login para ver seus ingressos.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`http://192.168.0.101:3001/api/v1/usuarios/${userId}/ingressos`);
                setIngressos(response.data);
            } catch (err) {
                console.error("Erro ao buscar meus ingressos:", err);
                setError("Não foi possível carregar seus ingressos. Verifique sua conexão ou tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchIngressos();
    }, [userId]);

    return (
        <>
            {/* Header no topo, como na HomePage */}
            <HomePageHeader
                termoBusca={termoBusca}
                setTermoBusca={setTermoBusca}
                handleFilter={handleFilter}
            />

            <Container
                maxWidth={false}
                disableGutters
                className="meus-ingressos-main-container" // Classe para estilização de fundo
            >
                <Box className="meus-ingressos-content-box">
                    <Typography variant="h4" component="h1" className="meus-ingressos-title">
                        Meus Ingressos
                    </Typography>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress sx={{ color: '#007bff' }} /> {/* Cor do spinner, ajuste se precisar */}
                            <Typography variant="body1" sx={{ ml: 2, color: '#f0f0f0' }}>Carregando seus ingressos...</Typography>
                        </Box>
                    )}

                    {error && (
                        <Typography variant="body1" className="error-message">
                            {error}
                        </Typography>
                    )}

                    {!loading && !error && ingressos.length === 0 ? (
                        <Typography variant="body1" className="no-ingressos-message">
                            Você ainda não comprou nenhum ingresso. Que tal explorar alguns eventos?
                        </Typography>
                    ) : (
                        <Box className="ingressos-list">
                            {ingressos.map((ingresso) => (
                                <Box key={ingresso._id} className="ingresso-card">
                                    {ingresso.evento_id && (
                                        <>
                                            <Typography variant="h5" component="h3" className="ingresso-evento-title">
                                                {ingresso.evento_id.titulo}
                                            </Typography>
                                            <Typography variant="body2" className="ingresso-evento-details">
                                                Local: {ingresso.evento_id.local}
                                            </Typography>
                                            <Typography variant="body2" className="ingresso-evento-details">
                                                Data: {new Date(ingresso.evento_id.data).toLocaleDateString('pt-BR')} às {new Date(ingresso.evento_id.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                            {ingresso.evento_id.imagem && (
                                                <img src={ingresso.evento_id.imagem} alt={ingresso.evento_id.titulo} className="ingresso-evento-imagem" />
                                            )}
                                        </>
                                    )}
                                    <Typography variant="h6" component="h4" className="ingresso-card-subtitle">
                                        Detalhes da Compra
                                    </Typography>
                                    <Typography variant="body1" className="ingresso-detail">
                                        Ingresso: <strong>{ingresso.nome_ingresso_comprado}</strong>
                                    </Typography>
                                    <Typography variant="body1" className="ingresso-detail">
                                        Quantidade: {ingresso.quantidade_comprada}
                                    </Typography>
                                    <Typography variant="body1" className="ingresso-detail">
                                        Preço unitário: R$ {ingresso.preco_pago ? ingresso.preco_pago.toFixed(2).replace('.', ',') : 'N/A'}
                                    </Typography>
                                    <Typography variant="body1" className="ingresso-detail">
                                        Preço Total: R$ {(ingresso.preco_pago * ingresso.quantidade_comprada).toFixed(2).replace('.', ',')}
                                    </Typography>
                                    <Typography variant="body2" className="ingresso-detail">
                                        Comprado em: {new Date(ingresso.data_compra).toLocaleDateString('pt-BR')}
                                    </Typography>
                                    {ingresso.codigo_ingresso && (
                                        <Typography variant="body1" className="ingresso-detail">
                                            Código: <strong>{ingresso.codigo_ingresso}</strong>
                                        </Typography>
                                    )}
                                    <Typography variant="body1" className="ingresso-detail">
                                        Status: <span className={`status-${ingresso.status}`}>{ingresso.status}</span>
                                    </Typography>
                                
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Container>
        </>
    );
}

export default MeusIngressos;