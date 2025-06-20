import "@fontsource/poppins";
import { Route, Routes } from "react-router-dom";

// Ajustei o nome do import de EventoDetalhado para EventoUnico para consistência
import EventoUnico from "./pages/Eventos/EventoDetalhado"; // Mantive o caminho original do seu arquivo
import EventosPage from "./pages/Eventos/EventosPage";
import Patrocinio from './pages/Patrocinio/Patrocinio'; // Componente Patrocinio original (Página principal de Patrocinio)
import Patrocinio2 from './pages/Patrocinio/Patrocinio2'; // Outro componente Patrocinio
import PaginaPatrocinio from './pages/Patrocinio/Patrocinio'; // Este é o componente específico que criamos para o patrocínio por evento ID.
import MeusIngressos from './Register/components/MeusIngressos';
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./Register/pages/Login";
import { RegisterPage } from "./Register/pages/Register";
import { SuccessfullRegisterPage } from "./Register/pages/SuccessfullRegister";
import CriarEvento from "./Register/pages/CriarEvento";
import ConfirmacaoEvento from './pages/Eventos/ConfirmacaoEvento';
import MeusEventos from "./pages/Eventos/MeusEventos";
import IngressosPage from './pages/Ingressos/IngressosPage';
import PagamentoIngresso from './pages/PagamentoIngresso/PagamentoIngresso';

// Importe o novo componente EditarEvento
// ASSUMindo que ele está na mesma pasta dos outros componentes de evento
import EditarEvento from './pages/Eventos/EditarEvento'; // <--- NOVA IMPORTAÇÃO AQUI

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventosPage />} />
      {/* Ajustei o nome do elemento para EventoUnico para consistência */}
      <Route path="/evento/:id" element={<EventoUnico />} />
      <Route path="/meus-eventos" element={<MeusEventos />} />
      <Route path="/evento/:id/ingressos" element={<IngressosPage />} />
      <Route path="/pagamento-ingresso" element={<PagamentoIngresso />} />
      <Route path="/patrocinio" element={<Patrocinio />} />
      <Route path="/patrocinio2" element={<Patrocinio2 />} />
      {/* Rota para a página de patrocínio de evento específica */}
      <Route path="/patrocinar/:id" element={<PaginaPatrocinio />} /> {/* Esta é a rota que conecta o botão */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/cadastro-com-sucesso" element={<SuccessfullRegisterPage />} />
      <Route path="/criar-evento" element={<CriarEvento />} />
      <Route path="/confirmacaoevento" element={<ConfirmacaoEvento />} />
      <Route path="/meus-ingressos" element={<MeusIngressos />} />
      {/* Rota para edição de eventos */}
      <Route path="/editar-evento/:id" element={<EditarEvento />} />

    </Routes>
  );
}

export default App;
