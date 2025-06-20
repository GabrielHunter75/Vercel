import React, { useState, useEffect, useRef } from 'react';

const categorias = ['shows', 'stand up comedy', 'tecnologia', 'investimento'];

const SearchShow = () => {
  const [termo, setTermo] = useState('');
  const [eventos, setEventos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/eventos')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!termo.trim()) {
      setFiltrados([]);
      setShowDropdown(false);
      return;
    }

    const termoLower = termo.toLowerCase().trim();
    const isCategoria = categorias.includes(termoLower);

    let resultado = [];

    if (isCategoria) {
      resultado = eventos.filter(e => e.categoria.toLowerCase() === termoLower);
    } else {
      resultado = eventos.filter(e => e.titulo.toLowerCase().includes(termoLower));
    }

    setFiltrados(resultado);
    setShowDropdown(true);
  }, [termo, eventos]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        placeholder="Buscar eventos ou categorias"
        value={termo}
        onChange={e => setTermo(e.target.value)}
        onFocus={() => termo && setShowDropdown(true)}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />

      {showDropdown && filtrados.length > 0 && (
        <ul
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#222',
            color: 'white',
            listStyle: 'none',
            margin: 0,
            padding: '8px 0',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            zIndex: 1000,
          }}
        >
          {filtrados.map(evento => (
            <li
              key={evento._id}
              onClick={() => {
                console.log('Evento clicado:', evento);
                setShowDropdown(false);
                setTermo(evento.titulo);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #444'
              }}
              onMouseDown={e => e.preventDefault()}
            >
              <strong>{evento.titulo}</strong> — <em>{evento.categoria}</em>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && filtrados.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#222',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            zIndex: 1000,
          }}
        >
          Nenhum evento encontrado.
        </div>
      )}
    </div>
  );
};

export default SearchShow;
