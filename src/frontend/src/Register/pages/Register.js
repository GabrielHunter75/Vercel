import { Box, Container, Grid, Typography } from "@mui/material";
import "../style/register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailNovamente, setEmailNovamente] = useState("");
  const [senhaNovamente, setSenhaNovamente] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cnpjNovamente, setCnpjNovamente] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      nome,
      email,
      senha,
      data_criacao: new Date(),
      eventos_inscritos: [],
      eventos_criados: [],
      tipo_usuario: "normal",
    };

    try {
      const response = await fetch("http://localhost:3001/api/v1/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert("Ocorreu um erro!");
        return;
      }

      alert("Cadastro realizado com successo!");
      navigate("/cadastro-com-sucesso");
    } catch (err) {
      alert("Ocorreu um erro!");
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: "rgba(18, 18, 18, 1)",
        minHeight: "100vh",
        maxWidth: "100vw !important",
        paddingLeft: "0 !important",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      <Header></Header>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-evenly",
          paddingTop: "30px",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: "20px",
            fontWeight: "700",
          }}
          fontFamily={"poppins"}
        >
          Junte-se a nós e fique por dentro das novidades
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "50px",
          margin: "0px 8vw",
          padding: "30px",
        }}
      >
        <Grid
          container
          spacing={2}
          rowSpacing={3}
          sx={{
            padding: "40px 100px",
            borderRadius: "21px",
            backgroundColor: "#1E1E1E",
          }}
        >
          <Grid size={6}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
            />
          </Grid>
          <Grid size={6}>
            <input
              placeholder="Digite o email novamente"
              type="email"
              value={emailNovamente}
              onChange={(e) => setEmailNovamente(e.target.value)}
              className="register-input"
            />
          </Grid>

          <Grid size={6}>
            <input
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="register-input"
            />
          </Grid>
          <Grid size={6}>
            <input
              placeholder="Digite a senha novamente"
              type="password"
              value={senhaNovamente}
              onChange={(e) => setSenhaNovamente(e.target.value)}
              className="register-input"
            />
          </Grid>

          <Grid size={6}>
            <input
              placeholder="CPF"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="register-input"
            />
          </Grid>
          <Grid size={6}>
            <input
              placeholder="Nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="register-input"
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          rowSpacing={3}
          sx={{
            padding: "40px 100px",
            borderRadius: "21px",
            backgroundColor: "#1E1E1E",
          }}
        >
          <Grid size={9}>
            <input
              placeholder="Digite seu endereço"
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="register-input"
            />
          </Grid>

          <Grid size={3}>
            <input
              placeholder="Número"
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="register-input"
            />
          </Grid>

          <Grid size={6}>
            <input
              placeholder="Cep"
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="register-input"
            />
          </Grid>
          <Grid size={6}>
            <input
              placeholder="Bairro"
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="register-input"
            />
          </Grid>

          <Grid size={6}>
            <input
              placeholder="Cidade"
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="register-input"
            />
          </Grid>
          <Grid size={6}>
            <input
              placeholder="Estado"
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="register-input"
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          rowSpacing={3}
          sx={{
            padding: "40px 100px",
            borderRadius: "21px",
            backgroundColor: "#1E1E1E",
            width: "100%",
          }}
        >
          <Grid size={12}>
            <Typography
              sx={{
                color: "white",
                fontSize: "20px",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "20px",
              }}
              fontFamily={"poppins"}
            >
              Informe seu CNPJ caso seja um organizador ou patrocinador
            </Typography>
          </Grid>

          <Grid size={6}>
            <input
              placeholder="CNPJ"
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="register-input"
            />
          </Grid>

          <Grid size={6}>
            <input
              placeholder="Digite novamente o CNPJ"
              type="text"
              value={cnpjNovamente}
              onChange={(e) => setCnpjNovamente(e.target.value)}
              className="register-input"
            />
          </Grid>
        </Grid>

        <button
          style={{
            width: "150px",
            height: "50px",
            fontFamily: "Poppins",
            fontWeight: "700",
            fontSize: "16px",
            color: "white",
            backgroundColor: "#c28840",
            margin: "0 auto",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          type="submit"
        >
          Cadastrar
        </button>
      </form>
    </Container>
  );
};
