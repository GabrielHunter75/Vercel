const request = require('supertest');
const app = require('../index'); // não faz app.listen()

jest.setTimeout(30000);

describe('Testes de Sistema - EventFlow', () => {

  let eventoId = null;

  it('Deve criar um novo evento com sucesso', async () => {
    const res = await request(app)
      .post('/api/v1/eventos')
      .send({
        titulo: "Evento Completo Teste",
        local: "São Paulo",
        data: new Date().toISOString(),
        descricao: "Descrição de teste completo",
        faixa_etaria: "18-35",
        categoria: "647dfb9258e4bcadbaf10cc1",
        organizador_id: "681de656658f5dae6a1586c5",
        participantes: [],
        privado: false,
        chave_pix: "pix@teste.com"
      });

    expect(res.status).toBe(201);
    eventoId = res.body._id;
  });

  it('Deve buscar o evento pelo ID', async () => {
    const res = await request(app).get(`/api/v1/eventos/${eventoId}`);
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("Evento Completo Teste");
  });

  it('Deve listar todos os eventos', async () => {
    const res = await request(app).get('/api/v1/eventos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Deve gerar payload Pix corretamente', async () => {
    const res = await request(app)
      .post('/api/v1/gerar-pix')
      .send({
        chave: "pix@teste.com",
        nome: "Evento Completo Teste",
        cidade: "SÃO PAULO",
        valor: "50.00"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("copiaecola");
  });

});
