function gerarPayloadPix({ chave, nome, cidade, valor, txid = '***' }) {
  const format = (id, value) => {
    const size = String(value.length).padStart(2, '0');
    return `${id}${size}${value}`;
  };

  const payloadFormat = '000201';
  const merchantAccountInfo = format('26', format('00', 'BR.GOV.BCB.PIX') + format('01', chave));
  const merchantCategoryCode = '52040000';
  const transactionCurrency = '5303986';
  const transactionAmount = valor ? format('54', valor) : '';
  const countryCode = '5802BR';
  const merchantName = format('59', nome.substring(0, 25));
  const merchantCity = format('60', cidade.substring(0, 15));
  const additionalDataField = format('62', format('05', txid));

  let payloadSemCRC = payloadFormat +
    merchantAccountInfo +
    merchantCategoryCode +
    transactionCurrency +
    transactionAmount +
    countryCode +
    merchantName +
    merchantCity +
    additionalDataField +
    '6304';

  const crc16 = calcularCRC16(payloadSemCRC).toUpperCase();
  return payloadSemCRC + crc16;
}

function calcularCRC16(payload) {
  let polinomio = 0x1021;
  let resultado = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    resultado ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
      resultado &= 0xFFFF;
    }
  }
  return resultado.toString(16).padStart(4, '0');
}

module.exports = { gerarPayloadPix };
