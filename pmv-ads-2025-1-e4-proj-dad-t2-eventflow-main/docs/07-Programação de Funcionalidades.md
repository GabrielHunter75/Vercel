# Programação de Funcionalidades

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>, <a href="4-Metodologia.md"> Metodologia</a>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>, <a href="5-Arquitetura da Solução.md"> Arquitetura da Solução</a>

# Implementação do Sistema

##  Requisitos Funcionais

### RF-001: Cadastro de Usuários
- **Descrição**: O sistema deve permitir o cadastro de usuários.
- **Artefato**: `UserRegistration.js`
- **Estruturas de Dados**:
  - Coleção: `users`
  ```json

      "_id": "ObjectId",
      "nome": "string",
      "email": "string",
      "senha": "string",
      "data_criacao": "ISODate",
      "eventos_inscritos": ["ObjectId"],
      "eventos_criados": ["ObjectId"],
      "tipo_usuario": "string"



### RF-002: Criação e Gerenciamento de Eventos
- **Descrição**: O sistema deve permitir que os organizadores criem e gerenciem eventos.
- **Artefato**: `EventManagement.js`
- **Estruturas de Dados**:
  - Coleção: `events`
  ```json

    "_id": "ObjectId",
    "titulo": "string",
    "local": "string",
    "data": "ISODate",
    "descricao": "string",
    "faixa_etaria": "string",
    "imagem": "string",
    "categoria": "string",
    "organizador_id": "ObjectId",
    "participantes": ["ObjectId"],
    "privado": "boolean",
    "criado_em": "ISODate",
    "atualizado_em": "ISODate"



### RF-003: Inscrição em Eventos
- **Descrição**:O sistema deve permitir que os usuários se inscrevam em eventos.
- **Artefato**: `EventRegistration.js`
- **Estruturas de Dados**:
  - Coleção: `registrations`
  ```json

    "_id": "ObjectId",
    "usuario_id": "ObjectId",
    "evento_id": "ObjectId",
    "data_inscricao": "ISODate",
    "status": "string"


### RF-004: Notificação dos eventos
- **Descrição**: O sistema deve enviar notificações sobre eventos e atualizações.
- **Artefato**: `NotificationService.js`
- **Estruturas de Dados**:
  - Coleção: `notifications`
  ```json
 
      "_id": "ObjectId",
      "user_id": "ObjectId",
      "evento_id": "ObjectId",
      "mensagem": "string",
      "data_envio": "ISODate",
      "status": "string"


### RF-005: Busca e filtragem  por eventos
- **Descrição**: O sistema deve permitir a busca e filtragem de eventos por categoria
- **Artefato**: `EventSearch.js`
- **Estruturas de Dados**:
  - Coleção: `events`
  ```json
 
   "_id": "ObjectId",
    "titulo": "string",
    "local": "string",
    "data": "ISODate",
    "descricao": "string",
    "faixa_etaria": "string",
    "imagem": "string",
    "categoria": "string",
    "organizador_id": "ObjectId",
    "participantes": ["ObjectId"],
    "privado": "boolean",
    "criado_em": "ISODate",
    "atualizado_em": "ISODate"



### RF-006: Compartilhamento dos eventos
- **Descrição**:O sistema deve permitir o compartilhamento de eventos em redes sociais.
- **Artefato**: `SocialShare.js`
- **Estruturas de Dados**:
Pode ser integrado com APIs de redes sociais

### RF-007: Relatório de participação nos eventos
- **Descrição**: O sistema deve disponibilizar relatórios sobre participação em eventos.
- **Artefato**: `EventReports.js`
- **Estruturas de Dados**:
  - Coleção: ` event_participation`
  ```json
 
 
      "_id": "ObjectId",
      "evento_id": "ObjectId",
      "usuario_id": "ObjectId",
      "data_participacao": "ISODate"

  
### RF-008: Edição de detalhes dos eventos
- **Descrição**: O sistema deve permitir que os organizadores editem detalhes do evento.
- **Artefato**: `EventUpdate.js`
- **Estruturas de Dados**:
  - Coleção: `events`
  ```json
 
    "_id": "ObjectId",
    "titulo": "string",
    "local": "string",
    "data": "ISODate",
    "descricao": "string",
    "faixa_etaria": "string",
    "imagem": "string",
    "categoria": "string",
    "organizador_id": "ObjectId",
    "participantes": ["ObjectId"],
    "privado": "boolean",
    "criado_em": "ISODate",
    "atualizado_em": "ISODate"

  
### RF-009: Gerar qr code para eventos
- **Descrição**: O sistema deve permitir a geração de ingressos ou QR codes para eventos.
- **Artefato**: `TicketGenerator.js`
- **Estruturas de Dados**:
  - Coleção: ` tickets`
  ```json
 
     _id": "ObjectId",
      "evento_id": "ObjectId",
      "usuario_id": "ObjectId",
      "qr_code": "string",
      "data_geracao": "ISODate"
  
### RF-0010: Gerar qr code para eventos
- **Descrição**:O sistema deve permitir que usuários enviem feedback sobre eventos.
- **Artefato**: `EventFeedback.js`
- **Estruturas de Dados**:
  - Coleção: `feedback`
  ```json
  
     "_id": "ObjectId",
      "evento_id": "ObjectId",
      "usuario_id": "ObjectId",
      "comentario": "string",
      "nota": "number",
      "data_envio": "ISODate"

### RF-0011: Gerar qr code para eventos
- **Descrição**:O sistema deve oferecer integração com calendários digitais.
- **Artefato**: `CalendarIntegration.js`
- **Estruturas de Dados**:
Não requer nova estrutura de dados. Pode ser integrado com Google Calendar, Outlook

### RF-0012: Gerar qr code para eventos
- **Descrição**:O sistema deve permitir a criação de eventos privados e restritos.
- **Artefato**: `PrivateEvents.js`
- **Estruturas de Dados**:
  - Coleção: `events `
  ```json
  
      "_id": "ObjectId",
      "nome": "string",
      "descricao": "string",
      "categoria": "string",
      "data": "ISODate",
      "localizacao": "string",
      "organizador_id": "ObjectId",
      "privado": "boolean"


## Requisitos Não Funcionais (RNF)

### RNF-001: A senha do usuário deve conter no mínimo oito caracteres. → Implementado na validação de cadastro (UserRegistration.js).

### RNF-002: O sistema deve ser fácil de usar e intuitivo. → Aplicação de UX/UI amigável.

### RNF-003: O sistema deve ser capaz de processar e responder às solicitações rapidamente. → Otimização de banco de dados, uso de cache, e requisições assíncronas.

### RNF-004: O sistema deve estar disponível 24/7. → Deploy em serviços escaláveis, como AWS ou Heroku.

### RNF-005: O sistema deve ser compatível com navegadores modernos e dispositivos móveis. → Desenvolvimento responsivo com React Native / Web.

### RNF-006: A interface deve ser responsiva e acessível para diferentes públicos. → Seguir padrões de acessibilidade (WCAG).
