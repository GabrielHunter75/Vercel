import { Container, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Confirme o caminho
import loginImage from "../../assets/loginImage.png";
import Header from "../components/header";
import "../style/register.css";


export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Agora 'login' é a função assíncrona do AuthContext

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => { // Tornar async
    event.preventDefault();
    setErrorMessage(""); // Limpa mensagens anteriores
    setLoading(true); // Ativa o loading

    if (!email || !senha) {
      setErrorMessage("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      await login(email, senha); // Chama a função login do contexto com email E senha
      navigate("/"); // Navega para a página inicial após o sucesso
    } catch (error) {
      setErrorMessage(error.message || "Erro desconhecido ao fazer login.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: "rgba(18, 18, 18, 1)",
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw !important",
        paddingLeft: "0 !important",
      }}
    >
      <Header />

      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "70px",
          gap: "35px",
        }}
      >
        <img
          src={loginImage}
          alt=""
          style={{
            width: "45%",
          }}
        />
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "50px",
            borderRadius: "21px",
            backgroundColor: "#1E1E1E",
            width: "100%",
            height: "100%",
            padding: "30px",
          }}
          onSubmit={handleSubmit}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "50px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
            fontFamily={"poppins"}
          >
            LOGIN
          </Typography>

          {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />

          <button
            style={{
              width: "100px",
              height: "40px",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "15px",
              color: "white",
              backgroundColor: "#c28840",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: "400",
              fontSize: "25px",
              color: "white",
              marginBottom: "20px",
            }}
          >
            Não tem uma conta?{" "}
            <Link
              to={`/cadastro`}
              style={{ textDecoration: "none", color: "#C28840" }}
            >
              Cadastre-se
            </Link>
          </span>
        </form>
      </Container>
    </Container>
  );
};