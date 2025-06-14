import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/logo.png';
import './CSS/Patrocinio.css'; 


function Patrocinio2() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <header className="header">
        <img src={require('../../assets/logo.png')} alt="Logo" className="logo" />
      </header>

      <main className="content">
        <h2 className="title">COPIE E COLE O CÓDIGO NO SEU BANCO DE PREFERÊNCIA</h2>
        <p className="code">a56c-4928-93be-9b7bf14beeab</p>

        <div className="infoBox">
  <p className="text">
    Entre em contato com o organizador para organizar sua participação no patrocínio do evento:
  </p>
  <p className="contact">
    +55 (31) 1234-5678<br />Carlos Henrique
  </p>
</div>

        <div className="buttonContainer">
          <button className="button" onClick={() => navigate('/Patrocinio')}>Voltar</button>
          <button className="button" onClick={() => alert('Pagamento confirmado!')}>Confirmar pagamento</button>
        </div>
      </main>
    </div>
  );
}

export default Patrocinio2;
