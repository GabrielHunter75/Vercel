# Arquitetura da Solução

<span style="color:red">Pré-requisitos: <a href="3-Projeto de Interface.md"> Projeto de Interface</a></span>
 ![Cópia do eventFlowDiagrama drawio](https://github.com/user-attachments/assets/d4e26405-8ce1-4142-b420-ee07abd3fdfa)




## Diagrama de Classes

![ESSE Diagrama de Classes EIXO 4 (ATUALIZADO 2 0) drawio](https://github.com/user-attachments/assets/13a6d6d1-2e01-4fca-8f20-fa50dc5f5ffd)




## Documentação do Banco de Dados MongoDB

Este documento descreve a estrutura e o esquema do banco de dados não relacional utilizado por nosso projeto, baseado em MongoDB. O MongoDB é um banco de dados NoSQL que armazena dados em documentos JSON (ou BSON, internamente), permitindo uma estrutura flexível e escalável para armazenar e consultar dados.

## Esquema do Banco de Dados

### Coleção: users
```
Armazena as informações dos usuários do sistema.

{
    "id": 1,
    "nome": "John Doe",
    "email": "john.doe@example.com",
    "senha": "hash_da_senha",
    "tipo_patrocinio": "Gold",
    "eventoInscritos": "5f8d0d55b54764421b7156a1,5f8d0d66b54764421b7156a2",
    "identidade": "123.456.789-00",
    "cnpj": "12.345.678/0001-99",
    "endereço": "Rua Exemplo, 123, Cidade, Estado, CEP 12345-678"
}



                                 Descrição dos Campos

* id:Identificador único do usuário gerado automaticamente pelo MongoDB, armazenado como um número inteiro..
* name: Nome completo do usuário.
* email: Endereço de email do usuário.
* senha: Hash da senha do usuário.
* tipo_patrocinio: Categoria de patrocínio do usuário, caso seja um patrocinador.
* eventos_inscritos:Lista contendo os identificadores dos eventos nos quais o usuário está inscrito, armazenada como uma string separada por vírgulas.
* identidade: Número de CPF ou RG do usuário.
* cnpj: Número do CNPJ do usuário, caso aplicável.
* endereço: Endereço completo do usuário, incluindo rua, número, cidade, estado e CEP.



```

## Coleção: events
```
Armazena as informações dos eventos criados na plataforma no sistema.

{
    "_id": "ObjectId('5f8d0d55b54764421b7156b1')", ok
    "titulo": "Tech Conference 2024",ok
    "local": "São Paulo Expo, SP",ok
    "data": "2024-09-15T14:00:00Z",ok
    "descricao": "Uma conferência sobre as últimas tendências em tecnologia e inovação.",ok
    "faixa_etaria": "18+",
    "imagem": "https://example.com/imagem-evento.jpg",
    "categoria": "Tecnologia",
    "organizador_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "participantes": ["ObjectId('5f8d0d55b54764421b7156a1')", "ObjectId('5f8d0d66b54764421b7156a2')"],
    "privado": false,
    "criado_em": "2024-08-29T10:00:00Z",
    "atualizado_em": "2024-08-30T12:00:00Z"
}

                 Descrição dos Campos

* id:Identificador único do usuário gerado automaticamente pelo MongoDB.
* titulo Nome ou título do evento.
* local: Local onde o evento será realizado.
* data:Data e hora do evento em formato ISO 8601.
* descrição:Breve descrição sobre o evento.
* faixa_etaria: Faixa etária recomendada para o evento (por exemplo, "Livre", "18+").
* imagem: URL de uma imagem representativa do evento.
* categoria: URL de uma imagem representativa do evento.
* organizador_id: Referência ao organizador do evento, associando-se ao _id da tabela users.
* participantes: Lista contendo os identificadores dos usuários inscritos no evento.
* privado: Define se o evento é público (false) ou privado (true).
* criado_em:  Data e hora de criação do evento.
* atualizado em : Data e hora da última atualização do evento.

````
### Coleção: registrations
```

Armazena informações sobre as inscrições dos usuários em eventos
{
    "_id": "ObjectId('5f8d0e55b54764421b7156c1')",
    "usuario_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "evento_id": "ObjectId('5f8d0d55b54764421b7156b1')",
    "data_inscricao": "2024-08-30T15:30:00Z",
    "status": "confirmado"
}

                     Descrição dos Campos

* id: Identificador único da inscrição, gerado automaticamente pelo MongoDB.
* usuario_id: Referência ao identificador do usuário inscrito, associando-se ao _id da tabela users.
* evento_id: Referência ao identificador do evento em que o usuário se inscreveu, associando-se ao _id da tabela events.
* data_inscricao:Data e hora da inscrição no evento, registrada no formato ISO 8601.
* status: Status da inscrição, podendo assumir os valores "confirmado", "pendente" ou "cancelado".

```

### Coleção: Feedback
```
Armazena informações a satisfação dos usuários em relação aos eventos

  {
    "_id": ObjectId("5f8d0e55b54764421b7156c1"),
    "usuario_id": ObjectId("5f7e1bbf9b2a4f1a9c38b9a1"),
    "evento_id": ObjectId("5f8d0d55b54764421b7156b1"),
    "comentario": "O evento foi muito bem organizado e instrutivo.",
    "classificacao": "Ótimo"
}

                     Descrição dos Campos

* id: Identificador único da inscrição, gerado automaticamente pelo MongoDB.
* usuario_id: Referência ao identificador do usuário inscrito, associando-se ao _id da tabela users.
* evento_id: Referência ao identificador do evento em que o usuário se inscreveu, associando-se ao _id da tabela events.
* comentário: Espaço aberto para usuários deixarem seu feedback sobre o evento.
* classificação :Espaço para o usuário classificar o evento em Ruim, Bom, Ótimo .

```
### Coleção: Patrocinio
```
Armazena informações a satisfação dos usuários em relação aos eventos

{
    "_id": ObjectId("5f8d0e55b54764421b7156c1"),
    "patrocinador": "Empresa XYZ",
    "evento_id": ObjectId("5f8d0d55b54764421b7156b1"),  
    "quantidade_patrocinada": 5000.00,  
    "data_patrocinio": ISODate("2025-02-01T00:00:00Z"),  
    "tipo_patrocinio": "financeiro",  
    "contato": "31 98766-0354"  
}

                         Descrição dos Campos

* id: Identificador único da inscrição, gerado automaticamente pelo MongoDB.
* patrocinador:Nome do patrocinador (ex.: empresa, pessoa física).
* evento_id: Referência ao identificador do evento patrocinado, associando-se ao _id da coleção eventos.
* quantidade_patrocinada: Valor monetário investido pelo patrocinador (tipo Number para cálculos).
* data_Patrocinio: Data em que o patrocínio foi realizado (tipo ISODate para facilitar manipulações de data).
* tipo_patrocinio:  Especificação do tipo de patrocínio ("financeiro", "serviços", etc.).
* contato: Meio de contato do patrocinador (string).

```
### Coleção: Notifications
```
Armazena as notificações enviada aos usuários

{
    "_id": ObjectId("5f8d0e55b54764421b7156c1"),
    "usuario_id": ObjectId("5f7e1bbf9b2a4f1a9c38b9a1"),
    "evento_id": ObjectId("5f8d0d55b54764421b7156b1"),  
    "mensagem": "Um evento que você está inscrito está se aproximando",  
    "tipo": "alerta"
}


                         Descrição dos Campos

* id: Identificador único da inscrição, gerado automaticamente pelo MongoDB.
* usuario_id: Referência ao identificador do usuário que recebeu a notificação (associado ao _id da coleção usuarios).
* evento_id: Referência ao identificador do evento patrocinado, associando-se ao _id da coleção eventos.
* mensagem: Texto da notificação enviada ao usuário.
* tipo: Tipo da notificação (por exemplo, "alerta", "informativo", etc.).

```

### Boas Práticas

Validação de Dados: Implementar validação de esquema e restrições na aplicação para garantir a consistência dos dados.

Monitoramento e Logs: Utilize ferramentas de monitoramento e logging para acompanhar a saúde do banco de dados e diagnosticar problemas.

Escalabilidade: Considere estratégias de sharding e replicação para lidar com crescimento do banco de dados e alta disponibilidade.

### Material de Apoio da Etapa

Na etapa 2, em máterial de apoio, estão disponíveis vídeos com a configuração do mongo.db e a utilização com Bson no C#

## Tecnologias Utilizadas

# Frontend : 
>- React: Bibiloteca Javascript para criar interfaces na web e mobile.
>- Javascript: Linguagem de programação para implementar a lógica do frontend
>- 
# Backend: 
>- Node.js e Express.js: Serão usadas para criação de Api

# Banco de dados: 

>- MongoDb: será usada para configuração e armazenamento dos dados dos usuários

## Ferramentas de Desenvolvimento:
>- IDE: Visual Studio Code, usada para desenvolvimento em JavaScript, com suporte a extensões que facilitam a codificação e depuração.
>- Insomnia: Ferramenta para testar APIs, permitindo enviar requisições HTTP e visualizar respostas.

## Controle de Versão
>- GitHub: Plataforma para hospedagem de repositórios Git, facilitando a colaboração e o versionamento do projeto.

 ### Fluxo de Comunicação

1. O usuário acessa a aplicação via web ou mobile.
2. O front-end envia requisições para o back-end via API REST.
3. O back-end processa as requisições e interage com os bancos de dados (MongoDB).
4. O back-end retorna os dados processados ao front-end.
5. O API Gateway gerencia e agrega informações de diversas fontes para otimizar a resposta.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

> **Links Úteis**:
>
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting Started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando Seu Site No Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)

## Qualidade de Software

Conceituar qualidade de fato é uma tarefa complexa, mas ela pode ser vista como um método gerencial que através de procedimentos disseminados por toda a organização, busca garantir um produto final que satisfaça às expectativas dos stakeholders.

No contexto de desenvolvimento de software, qualidade pode ser entendida como um conjunto de características a serem satisfeitas, de modo que o produto de software atenda às necessidades de seus usuários. Entretanto, tal nível de satisfação nem sempre é alcançado de forma espontânea, devendo ser continuamente construído. Assim, a qualidade do produto depende fortemente do seu respectivo processo de desenvolvimento.

A norma internacional ISO/IEC 25010, que é uma atualização da ISO/IEC 9126, define oito características e 30 subcaracterísticas de qualidade para produtos de software.
Com base nessas características e nas respectivas sub-características, identifique as sub-características que sua equipe utilizará como base para nortear o desenvolvimento do projeto de software considerando-se alguns aspectos simples de qualidade. Justifique as subcaracterísticas escolhidas pelo time e elenque as métricas que permitirão a equipe avaliar os objetos de interesse.

> **Links Úteis**:
>
> - [ISO/IEC 25010:2011 - Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models](https://www.iso.org/standard/35733.html/)
> - [Análise sobre a ISO 9126 – NBR 13596](https://www.tiespecialistas.com.br/analise-sobre-iso-9126-nbr-13596/)
> - [Qualidade de Software - Engenharia de Software 29](https://www.devmedia.com.br/qualidade-de-software-engenharia-de-software-29/18209/)
