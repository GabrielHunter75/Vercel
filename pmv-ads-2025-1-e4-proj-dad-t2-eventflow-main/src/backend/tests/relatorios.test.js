const request = require('supertest');
const app = require('../index'); // não faz app.listen()

jest.setTimeout(30000);

describe("Testando as rotas de relatórios", () => {
  it("Deve retornar todos os relatórios", async () => {
    const res = await request(app).get("/api/v1/relatorios");
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });
});
