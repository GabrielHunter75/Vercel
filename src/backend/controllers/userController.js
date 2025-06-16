const User = require("../models/User");
// Se você usa bcrypt para hash de senha, importe-o aqui
// const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  console.log("Conteúdo de req.body recebido no backend:", req.body);
  try {
    const { email, password, username, /* outros campos */ } = req.body; // Desestruture os campos que você espera

    // 1. Verificação se o e-mail já existe (Boa Prática)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Este e-mail já está em uso. Por favor, use outro." });
    }

    // 2. Opcional: Hash da senha antes de criar o usuário (ALTAMENTE RECOMENDADO)
    // Se você estiver fazendo hash da senha no controller, faça aqui
    // const hashedPassword = await bcrypt.hash(password, 10); // 10 é o saltRounds

    const user = new User({
      email,
      // Se estiver fazendo hash no controller:
      // password: hashedPassword,
      // Se não, e o hash é feito no modelo (pre('save') hook):
      password: password, // Mantenha como está se o hash for no modelo
      username, // Use o nome do campo real do seu schema
      // ... outros campos que você espera no req.body
    });

    await user.save(); // Tenta salvar o novo usuário

    // 3. Resposta de sucesso
    res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: user._id });

  } catch (err) {
    console.error("Erro detalhado ao criar usuário:", err);

    // Identificação de erros específicos para mensagens mais amigáveis
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        return res.status(409).json({ message: "Este e-mail já está em uso. Por favor, use outro." });
    }
    if (err.name === 'ValidationError') {
        // Erros de validação do Mongoose (ex: campo obrigatório faltando)
        const errors = Object.keys(err.errors).map(key => err.errors[key].message);
        return res.status(400).json({ message: "Erro de validação:", errors });
    }
    // Erro genérico do servidor para outros problemas inesperados
    res.status(500).json({ message: "Erro interno do servidor ao criar usuário.", details: err.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err); // Boa prática adicionar também
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};