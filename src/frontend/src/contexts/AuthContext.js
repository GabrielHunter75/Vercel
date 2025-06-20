import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // A função login agora é assíncrona e faz a requisição para o backend
  const login = async (email, senha) => { // Aceita email E senha
    try {
      const response = await fetch('http://localhost:3001/api/v1/login', { // Rota de login no seu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }), // Envia email e senha
      });

      if (!response.ok) {
        // Se a resposta não for OK (ex: 401, 404), tenta ler a mensagem de erro do backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha no login. Credenciais inválidas.');
      }

      const userData = await response.json(); // Pega o objeto do usuário do backend (que contém o _id)
      console.log("Usuário logado e recebido do backend:", userData); // Log para verificar o _id

      setUser(userData); // Atualiza o estado do contexto com os dados completos do usuário
      localStorage.setItem('user', JSON.stringify(userData)); // Salva os dados completos no localStorage
      return userData; // Opcional: retorna os dados para a LoginPage se precisar
    } catch (error) {
      console.error("Erro durante o login no AuthContext:", error);
      throw error; // Propaga o erro para a LoginPage poder tratá-lo
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Garante que se o localStorage mudar externamente, atualiza o estado
  // O useState inicial já cobre a carga inicial, mas este useEffect pode ser útil para sincronização
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);