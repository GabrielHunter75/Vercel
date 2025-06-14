const request = require('supertest');
const app = require('../index');
const { connectDB, closeDB } = require('../db');

jest.setTimeout(30000);

beforeAll(async () => {
  await connectDB(app);
});

afterAll(async () => {
  await closeDB();
});

describe('Testes de rotas de Evento', () => {
  let eventoId = null;

  it('Deve cadastrar novo evento', async () => {
    const evento = {
      titulo: "Evento Jest",
      local: "São Paulo",
      data: new Date(),
      descricao: "Teste completo evento",
      faixa_etaria: "18-35",
      categoria: "647dfb9258e4bcadbaf10cc1",
      organizador_id: "681de656658f5dae6a1586c5",
      participantes: [],
      privado: false
    };

    const res = await request(app).post('/api/v1/eventos').send(evento);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    eventoId = res.body._id;
  });

  it('Deve buscar evento por ID', async () => {
    const res = await request(app).get(`/api/v1/eventos/${eventoId}`);
    expect(res.status).toBe(200);
  });

  it('Deve listar eventos', async () => {
    const res = await request(app).get('/api/v1/eventos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

