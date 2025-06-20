# Testes de Integração no Backend

## O que são Testes de Integração?

Testes de integração são testes automatizados que verificam se diferentes módulos ou componentes de um sistema funcionam corretamente quando integrados. Ao contrário dos testes unitários, que testam pequenas unidades isoladas de código, os testes de integração focam na interação entre várias partes do sistema, como classes, bancos de dados, APIs externas, entre outros.

## Por que são Importantes?

Testes de integração ajudam a:

- Garantir que os diferentes componentes do sistema funcionem bem juntos.
- Detectar problemas que possam surgir da interação entre módulos, como erros de comunicação ou incompatibilidades.
- Validar cenários de uso realistas, onde múltiplas partes do sistema precisam interagir.

## Configuração do Ambiente

Para começar a escrever testes de integração em um projeto backend utilizando C#, siga os passos abaixo:

1. **Instale o .NET SDK**: Certifique-se de ter o [.NET SDK](https://dotnet.microsoft.com/download) instalado.

2. **Crie um projeto de testes**: No terminal, navegue até o diretório do seu projeto e execute o seguinte comando para criar um projeto de testes usando xUnit:

    ```bash
    dotnet new xunit -o tests
    ```

3. **Adicione uma referência ao seu projeto principal**: No diretório do projeto de testes, adicione uma referência ao seu projeto principal:

    ```bash
    dotnet add reference ../src/MyProject.csproj
    ```

4. **Configure um banco de dados para testes**: Se seu projeto interage com um banco de dados, considere usar um banco de dados em memória (como o SQLite in-memory) ou configurar um ambiente de banco de dados separado para os testes.

5. **Organize sua estrutura de diretórios**: Uma estrutura comum de projeto é a seguinte:

    ```
    MyProject/
    ├── src/
    │   └── MyProject.cs
    └── tests/
        └── MyProject.IntegrationTests.cs
    ```

## Exemplo de Teste de Integração

Vamos supor que temos um método na classe `UserService` que adiciona um usuário a um banco de dados. Queremos testar se esse método funciona corretamente ao interagir com o banco de dados.

### Teste de eventos
![WhatsApp Image 2025-06-11 at 13 16 41](https://github.com/user-attachments/assets/2f8f53de-ab61-44f7-a6a1-573415686d15)

### Teste de integração
![WhatsApp Image 2025-06-11 at 13 54 40](https://github.com/user-attachments/assets/f5e84ea3-7ab9-4037-a8b3-710ea41c384c)

### Teste de pix
![WhatsApp Image 2025-06-11 at 15 19 23](https://github.com/user-attachments/assets/8e105636-ba49-4f48-b421-7eee55a33350)

### Teste de relatórios
![WhatsApp Image 2025-06-11 at 15 20 25](https://github.com/user-attachments/assets/8f91b156-1601-4576-898b-26412cf28734)

### Teste de sistemas
![WhatsApp Image 2025-06-11 at 15 21 14](https://github.com/user-attachments/assets/743a01ac-824a-4019-ba5d-a3f0c6b25fe7)

### Teste de usuário
![WhatsApp Image 2025-06-11 at 15 26 41](https://github.com/user-attachments/assets/22202453-5de3-452d-8f81-ef28f813f940)


