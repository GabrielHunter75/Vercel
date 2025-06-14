import { Container, Link, Typography } from "@mui/material";
import SuccessFullRegister from "../../assets/successfull-register.png";
import "../style/register.css";
import Header from "../components/header";

export const SuccessfullRegisterPage = () => {
  return (
    <Container
      sx={{
        backgroundColor: "rgba(18, 18, 18, 1)",
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw !important",
        paddingLeft: "0 !important",
        paddingRight: "0 !important",
      }}
    >
      <Header></Header>
      <Typography
        sx={{
          color: "white",
          fontSize: "30px",
          fontWeight: "700",
          textAlign: "center",
          marginTop: '30px'
        }}
        fontFamily={"poppins"}
      >
        Cadastro realizado com sucesso
      </Typography>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={SuccessFullRegister} alt=""></img>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button
            style={{
              height: "40px",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "15px",
              color: "white",
              backgroundColor: "#c28840",
              marginTop: "10px",
              padding: "0 20px",
            }}
          >
            Faça seu login clicando aqui
          </button>
        </Link>
      </Container>
    </Container>
  );
};
