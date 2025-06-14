# Testes Unitários no Backend

## O que são Testes Unitários?

Testes unitários são testes automatizados escritos e executados para garantir que pequenas partes individuais do código (unidades) funcionem conforme esperado. No contexto do desenvolvimento backend, isso geralmente significa testar funções, métodos ou classes de maneira isolada, sem dependências externas como bancos de dados ou serviços web.

## Por que são Importantes?

Testes unitários ajudam a:

- Identificar problemas de maneira precoce no ciclo de desenvolvimento.
- Garantir que o código continue funcionando após alterações (regressões).
- Facilitar o processo de refatoração.
- Melhorar a confiabilidade e a qualidade do software.

## Configuração do Ambiente

Para começar a escrever testes unitários em um projeto backend utilizando JavaScript com Jest e Supertest, siga os passos abaixo:

1. **Instale as dependências**: No terminal, navegue até o diretório do seu projeto e execute o seguinte comando:

    ```bash
    npm install --save-dev jest supertest
    ```

2. **Adicione um script de teste**: No seu `package.json`, adicione o seguinte script:

    ```json
    "scripts": {
      "test": "jest"
    }
    ```

3. **Organize sua estrutura de diretórios**: Uma estrutura comum de projeto é a seguinte:

    ```
    MyProject/
    ├── src/
    │   └── app.js
    └── tests/
        └── app.test.js
    ```

## Exemplo de Teste Unitário

Aqui está um exemplo simples de um teste unitário em JavaScript usando Jest e Supertest. Vamos supor que temos uma função em `app.js` que soma dois números.

```javascript
// src/app.js
function add(a, b) {
    return a + b;
}

module.exports = { add };

```

## Exemplo de Teste Unitário
const { add } = require('../src/app');

test('soma 1 + 2 para igualar 3', () => {
    expect(add(1, 2)).toBe(3);
});

## Executando os Testes:
 ```bash
    npm test
```
## Print dos testes

Teste Mariana (Criar evento, buscar evento criado e gerar payload pix para o evento)

![image](https://github.com/user-attachments/assets/e865f4f5-715f-4fd6-a14a-16ded5b0688d)



Teste Gabriel (realizar cadastro, fazer login, detalhes de evento, lista de evento )
![image (3)](https://github.com/user-attachments/assets/2827e3c7-8259-42e5-bc3a-3995182d62fa)

