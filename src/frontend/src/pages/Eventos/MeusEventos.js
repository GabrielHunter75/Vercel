import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from "../../Register/components/header"; // Importe o Header se não estiver importado

const MeusEventos = () => {
    const navigate = useNavigate();
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchMeusEventos = async () => {
            try {
                // Ajuste aqui para o endpoint correto da sua API:
                const response = await axios.get(`http://localhost:3000/api/v1/eventos/usuario/${user._id}`);
                setEventos(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar seus eventos:', err);
                setError('Não foi possível carregar seus eventos. Tente novamente mais tarde.');
                setLoading(false);
            }
        };

        fetchMeusEventos();
    }, [user, navigate]);

    const handleDetalhes = (id) => {
        navigate(`/evento/${id}`);
    };

    const handleEditar = (id) => {
        navigate(`/editar-evento/${id}`); // Redireciona para uma nova rota de edição
    };

    const handleDeletar = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este evento e todos os seus ingressos?')) {
            try {
                await axios.delete(`http://localhost:3000/api/v1/eventos/${id}`);
                // Remove o evento da lista após a exclusão bem-sucedida
                setEventos(eventos.filter(evento => evento._id !== id));
                alert('Evento deletado com sucesso!');
            } catch (error) {
                console.error('Erro ao deletar evento:', error);
                alert(`Erro ao deletar evento: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <Header /> {/* Adicionado o Header */}
            <h1 style={{ color: '#c57f39', marginBottom: '30px', textAlign: 'center' }}>Meus Eventos</h1>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Carregando...</p>
            ) : error ? (
                <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
            ) : eventos.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Você ainda não criou nenhum evento.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {eventos.map((evento) => (
                        <div
                            key={evento._id}
                            style={{
                                backgroundColor: '#1e1e1e',
                                borderRadius: '10px',
                                padding: '20px',
                                width: '320px', // Aumentado um pouco para acomodar botões
                                cursor: 'pointer',
                                border: '1px solid #c57f39',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            {evento.imagem && (
                                <img
                                    src={evento.imagem.startsWith('data:image') ? evento.imagem : `http://localhost:3000/uploads/${evento.imagem.split('/').pop()}`}
                                    alt={evento.titulo}
                                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                                />
                            )}
                            <h2 style={{ color: '#c57f39', fontSize: '1.4rem', marginBottom: '10px' }}>{evento.titulo}</h2>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '8px' }}>{evento.descricao.substring(0, 100)}...</p>
                            <p style={{ marginBottom: '5px' }}><strong>Categoria:</strong> {evento.categoria?.nome || 'N/A'}</p> {/* Exibe o nome da categoria */}
                            <p style={{ marginBottom: '5px' }}><strong>Data:</strong> {new Date(evento.data).toLocaleDateString()}</p>
                            <p style={{ marginBottom: '15px' }}><strong>Local:</strong> {evento.local}</p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDetalhes(evento._id); }}
                                    style={{
                                        backgroundColor: '#00aaff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 15px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        flexGrow: 1
                                    }}
                                >
                                    Ver Detalhes
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditar(evento._id); }}
                                    style={{
                                        backgroundColor: '#c57f39',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 15px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        flexGrow: 1
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeletar(evento._id); }}
                                    style={{
                                        backgroundColor: '#d32f2f',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 15px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        flexGrow: 1
                                    }}
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeusEventos;