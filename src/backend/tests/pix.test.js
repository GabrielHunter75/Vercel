const app = require('../index'); 

const { gerarPayloadPix } = require('../utils/gerarPayloadPix');

describe('Teste do gerarPayloadPix', () => {
  it('Deve gerar corretamente o payload Pix', () => {
    const payload = gerarPayloadPix({
      chave: 'pix@teste.com',
      nome: 'Evento Teste',
      cidade: 'SAO PAULO',
      valor: '50.00'
    });

    expect(payload).toMatch(/^00020126/);
    expect(payload).toContain('BR.GOV.BCB.PIX');
    expect(payload).toContain('pix@teste.com');
  });
});
