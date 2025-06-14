const request = require('supertest');
const app = require('../index');
const { connectDB, closeDB } = require('../db');

jest.setTimeout(30000); // tempo global

beforeAll(async () => {
  await connectDB(app);
});

afterAll(async () => {
  await closeDB();
});

describe('Testes de Integração Completa - EventFlow', () => {
  let eventoId = null;
  const userId = "681de656658f5dae6a1586c5"; // Substitua por um _id válido
  const categoriaId = "647dfb9258e4bcadbaf10cc1"; // Substitua por um _id válido

  it('Deve criar um novo evento com ingresso', async () => {
    const res = await request(app)
      .post('/api/v1/eventos')
      .send({
        titulo: "Show de Integração Final",
        local: "São Paulo",
        data: new Date().toISOString(),
        descricao: "Testando fluxo completo",
        faixa_etaria: "18-35",
        categoria: categoriaId,
        organizador_id: userId,
        participantes: [],
        privado: false,
        chave_pix: "pix@eventflow.com",
        ingresso: { preco: 120, quantidade: 50, descricao: "Setor VIP" }
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    eventoId = res.body._id;
  }, 20000);

  it('Deve buscar o evento pelo ID', async () => {
    const res = await request(app).get(`/api/v1/eventos/${eventoId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.titulo).toBe("Show de Integração Final");
  }, 10000);

  it('Deve listar todos os eventos', async () => {
    const res = await request(app).get('/api/v1/eventos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);

  it('Deve gerar payload Pix corretamente', async () => {
    const res = await request(app)
      .post('/api/v1/gerar-pix')
      .send({
        chave: "pix@eventflow.com",
        nome: "Show de Integração Final",
        cidade: "SÃO PAULO",
        valor: "240.00"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("copiaecola");
  }, 5000);

  it('Deve registrar uma compra com geração de PDF', async () => {
    const compraRes = await request(app)
      .post('/api/v1/compras')
      .send({
        userId: userId,
        eventId: eventoId,
        metodoPagamento: "pix",
        valorPago: 240,
        nomesParticipantes: ["João Silva", "Maria Oliveira"]
      });

    expect(compraRes.status).toBe(201);
    expect(compraRes.body).toHaveProperty("compra");
    expect(compraRes.body).toHaveProperty("pdfUrl");

    const pdfUrl = compraRes.body.pdfUrl.replace("http://192.168.0.101:3001", "");
    const pdfRes = await request(app).get(pdfUrl);
    expect(pdfRes.status).toBe(200);
  }, 15000);

  it('Deve buscar as compras do usuário', async () => {
    const res = await request(app).get(`/api/v1/compras?userId=${userId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);
});
