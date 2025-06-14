# Metodologia

## 📌 Pré-requisitos: Documentação de Especificação

A metodologia adotada pelo grupo garante uma abordagem estruturada para o desenvolvimento do projeto, abrangendo desde a organização do ambiente de trabalho até o controle de versão e a gerência de tarefas.

---

## 🌍 Relação de Ambientes de Trabalho

Os artefatos do projeto são desenvolvidos em diversas plataformas e ambientes, conforme a tabela abaixo:

| **Ambiente**            | **Plataforma/Ferramenta**      | **Propósito**                           |
|------------------------|--------------------------------|-----------------------------------------|
| Desenvolvimento        | Visual Studio Code / Expo     | Implementação do código-fonte          |
| Gerenciamento de Código| GitHub                         | Controle de versão e colaboração       |
| Banco de Dados        |             Mongo DB            | Armazenamento e recuperação de dados   |
| API                   | Node.js com Express.js        | Backend e serviços API REST            |
| Testes                |  jest supertest / Postman       | Testes unitários e de integração       |
| Documentação          | Markdown / Swagger           | Registro e documentação da API        |

---

## 🔄 Controle de Versão

O projeto utiliza **Git** como ferramenta de controle de versão e o **GitHub** como plataforma de hospedagem do repositório. 

### 🔹 Convenção de Branches:

- **`main`**: Versão estável e testada do software.
- **`unstable`**: Versão testada, porém instável.
- **`testing`**: Versão em testes.
- **`dev`**: Versão em desenvolvimento.

### 🏷️ Convenção de Issues:

- **`documentation`** → Melhorias ou acréscimos à documentação.
- **`bug`** → Correção de problemas identificados no código.
- **`enhancement`** → Melhorias em funcionalidades existentes.
- **`feature`** → Implementação de novas funcionalidades.

O fluxo de trabalho segue o modelo **Git Flow**, onde cada funcionalidade é desenvolvida em branches separadas e depois mesclada via **Pull Request**. Além disso, utilizamos a convenção **Conventional Commits** para um histórico de mudanças organizado.

---

## 🛠️ Gerenciamento de Projeto

### 👥 Divisão de Papéis

A equipe segue a metodologia ágil **Scrum** e está organizada da seguinte maneira:

- **🧭 Scrum Master**: Mariana Dias.
- **📌 Product Owner**: Gabriel
- **💻 Equipe de Desenvolvimento**: Mariana,Gabriel, Xavier,Pedro e Felipe - Implementação das funcionalidades.
- **🎨 Equipe de Design**: Mariana,Gabriel, Xavier,Pedro e Felipe- Responsável pela interface e experiência do usuário.

### 🔄 Processo de Desenvolvimento

A equipe utiliza **GitHub Projects** para acompanhar o progresso do projeto. O fluxo de desenvolvimento é organizado da seguinte forma:

1️⃣ **Planejamento da Sprint** → Definição das tarefas e prioridades junto ao Product Owner.  
2️⃣ **Desenvolvimento** → Implementação das funcionalidades conforme boas práticas de código.  
3️⃣ **Revisão e Testes** → Revisão de código entre pares e testes unitários e de integração.  
4️⃣ **Deploy e Monitoramento** → Publicação da versão e análise contínua para melhorias.

Para garantir maior confiabilidade no processo, utilizamos **Integração Contínua (CI/CD)** com **GitHub Actions**, possibilitando automação de testes e deploys de forma eficiente.

---

📌 **Conclusão**  
A metodologia aplicada busca otimizar o desenvolvimento, promovendo colaboração entre os membros e garantindo transparência em todas as etapas do projeto.
