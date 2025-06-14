const request = require('supertest');
const app = require('../index'); // não faz app.listen()

jest.setTimeout(30000);

describe('Testes de rotas de Usuário', () => {

  it('Deve cadastrar novo usuário com sucesso', async () => {
    const usuario = {
      nome: 'Usuario Teste Jest',
      email: `usuario_${Date.now()}@teste.com`,
      senha: 'senha123',
      tipo_usuario: 'normal'
    };

    const res = await request(app).post('/api/v1/usuarios').send(usuario);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('Deve listar usuários', async () => {
    const res = await request(app).get('/api/v1/usuarios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
