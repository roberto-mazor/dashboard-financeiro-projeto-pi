# 📊 Dashboard Financeiro Inteligente

## Introdução

O **Dashboard Financeiro Inteligente** é um sistema completo de gestão financeira pessoal desenvolvido para portfólio, focado em demonstrar proficiência em análise de dados, visualização e arquitetura Full Stack. O projeto permite aos usuários gerenciar transações financeiras, categorizar entradas e saídas, visualizar dados em tempo real através de gráficos interativos e alternar entre temas claro e escuro. A persistência de dados é realizada em nuvem utilizando PostgreSQL serverless.

**Objetivos:**
- Fornecer uma interface intuitiva para controle financeiro pessoal.
- Demonstrar habilidades em desenvolvimento Full Stack com tecnologias modernas.
- Implementar autenticação segura e isolamento de dados por usuário.
- Otimizar performance com estratégias anti-cold start para bancos serverless.

 **Links do Projeto**

 [![Acessar Aplicação](https://img.shields.io/badge/Acessar%20Aplicação%20Vercel.APP-Clique%20Aqui-0070f3?style=for-the-badge&logo=vercel&logoColor=white)](https://dashboard-financeiro-projeto-pi-web.vercel.app/login)

 [![Figma Design](https://img.shields.io/badge/Figma-Design_Prototyping-F24E1E?style=for-the-badge&logo=figma)](https://www.figma.com/design/CZdLGj7cyji3jCrJi4L4MB/Dashboard-financeiro-projeto-PI-Senac?node-id=7-672&t=pyxfEt9dFdHOWcag-0)

 [![FigJam Diagramas](https://img.shields.io/badge/FigJam-Diagrams_Flow-F24E1E?style=for-the-badge&logo=figma)](https://www.figma.com/board/PRCpvoC6MrcKUARoobVDV9/Diagramas-dashboard-financeiro-projeto-p?node-id=0-1&p=f&t=3RaSNnirl7oUtM5s-0)

---

### Design e Prototipagem (Figma)

O projeto foi inteiramente planejado no Figma antes e durante a implementação, garantindo consistência visual e uma experiência de usuário fluida. O protótipo foca na **Acessibilidade** (Modo Claro/Escuro) e na **Dashboard Responsiva**.

---

#### **Estrutura de Wireframe (Análise de UX)**

A estrutura foi dividida em três fluxos principais, respeitando a hierarquia de informação e a facilidade de navegação:

##### **1. Login e Onboarding**
* **Simbologia ISO:** O fluxo de entrada utiliza trapézios para input de dados e losangos para decisões de validação de e-mail/senha.
* **Fricção Reduzida:** Inclusão estratégica do botão "Dados de Teste" para acelerar a avaliação de recrutadores.

##### **2. Dashboard (Visão Analítica)**
* **Layout de Painel:** Organizado em um grid onde o saldo (valor principal) ocupa o topo, seguido por gráficos que traduzem números em insights visuais.
* **Componentização:** Uso de cards reutilizáveis para os resumos financeiros, facilitando a manutenção do código React.

##### **3. Gestão de Lançamentos**
* **Tabelas Adaptativas:** Wireframe focado em legibilidade, com ações de editar/excluir claras e formulários que não sobrecarregam a visão do usuário.

---

## Arquitetura

O projeto adota uma arquitetura **monolítica** com separação clara entre frontend e backend, hospedados em plataformas serverless para escalabilidade e baixo custo. O backend é uma API RESTful em Node.js/Express que gerencia a lógica de negócio, autenticação e acesso ao banco de dados. O frontend é uma Single Page Application (SPA) em React/Vite, responsável pela interface do usuário e consumo da API. O banco de dados PostgreSQL é hospedado no Neon.tech, um serviço serverless que entra em modo de repouso após inatividade, exigindo estratégias de "wake-up" para evitar latências.

- **Frontend:** Cliente web responsivo e interativo.
- **Backend:** Servidor API com autenticação JWT e ORM para abstração de dados.
- **Banco de Dados:** PostgreSQL serverless para persistência relacional.
- **Infraestrutura:** Hospedagem em Vercel para frontend e backend, com Neon para banco.

## Tecnologias Utilizadas

- **Frontend:**
  - **React.js (Vite):** Framework para construção de interfaces dinâmicas e rápidas, com Vite para bundling otimizado e hot reload durante desenvolvimento.
  - **Tailwind CSS:** Framework CSS utilitário para estilização responsiva e customização de temas (Light/Dark).
  - **MUI X Charts:** Biblioteca para visualização de dados avançada, utilizada para gráficos de pizza e barras, garantindo interatividade e acessibilidade.
  - **Lucide React:** Conjunto de ícones leves e elegantes para melhorar a UX.
  - **Axios:** Cliente HTTP para consumo da API backend, com interceptores para autenticação automática.

- **Backend:**
  - **Node.js & Express:** Plataforma para servidor web escalável, com Express para roteamento e middlewares.
  - **JWT (JSON Web Token):** Padrão para autenticação stateless, garantindo segurança nas rotas protegidas.
  - **Bcrypt.js:** Biblioteca para hash de senhas, protegendo credenciais de usuários.
  - **Sequelize (ORM):** Abstração de consultas SQL, facilitando o mapeamento objeto-relacional e migrações.

- **Banco de Dados & Infra:**
  - **PostgreSQL (Neon.tech):** Banco relacional serverless, escolhido por sua confiabilidade, suporte a ACID e otimização para aplicações em nuvem, reduzindo custos operacionais.

## Estrutura de Pastas

```
dashboard-financeiro-projeto-pi/
├── LICENSE
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── vercel.json
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── categoriaController.js
│       │   ├── dashboardController.js
│       │   ├── transacaoController.js
│       │   └── usuarioController.js
│       ├── middleware/
│       │   └── authMiddleware.js
│       ├── models/
│       │   ├── Categoria.js
│       │   ├── Transacao.js
│       │   └── Usuario.js
│       └── routes/
│           ├── authRoutes.js
│           ├── categoriaRoutes.js
│           ├── dashboardRoutes.js
│           └── transacaoRoutes.js
├── frontend/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── tailwind.config.js
│   ├── vercel.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── DashboardCharts.jsx
│       │   ├── SummaryCards.jsx
│       │   ├── TransactionForm.jsx
│       │   └── TransactionTable.jsx
│       ├── contexts/
│       │   └── ThemeContext.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── routes/
│       │   └── index.jsx
│       ├── services/
│       │   └── api.js
│       └── styles/
│           └── globals.css
└── public/
```

- **backend/:** Contém o código do servidor Node.js/Express, incluindo configurações, modelos, controladores, middlewares e rotas.
- **frontend/:** Estrutura do cliente React/Vite, com componentes, páginas, contextos e serviços.
- **public/:** Arquivos estáticos compartilhados, como imagens para documentação.

## Modelagem de Dados

O banco de dados utiliza PostgreSQL com as seguintes tabelas principais:

![Diagrama Entidade-Relacionamento](public/der_dashboard_financeiro.svg)

- **Usuarios:**
  - `id_usuario` (PK): Identificador único do usuário.
  - `email`: Endereço de e-mail único.
  - `senha_hash`: Hash da senha criptografada com Bcrypt.
  - `nome`: Nome completo do usuário.
  - Relacionamento: 1:N com Categorias e Transacoes (isolamento de dados por usuário).

- **Categorias:**
  - `id_categoria` (PK): Identificador único da categoria.
  - `id_usuario` (FK): Referência ao usuário proprietário.
  - `nome`: Nome da categoria (ex: Alimentação, Salário).
  - `tipo`: ENUM ('Receita' ou 'Despesa').
  - Relacionamento: 1:N com Transacoes.

- **Transacoes:**
  - `id_transacao` (PK): Identificador único da transação.
  - `id_usuario` (FK): Referência ao usuário.
  - `id_categoria` (FK): Referência à categoria.
  - `data`: Data da transação.
  - `valor`: Valor decimal da transação.
  - `descricao`: Descrição opcional.
  - Relacionamento: N:1 com Usuarios e Categorias.

Regras de negócio: Dados isolados por usuário; exclusão em cascata para limpeza automática; categorias padrão criadas automaticamente no cadastro.

O sistema foi modelado para oferecer uma experiência fluida, utilizando padrões de interação que automatizam processos de backend e facilitam o onboarding do usuário.

![Requisitos Funcionais e Casos de Uso (UML)](public/uml_dashboard_financeiro.svg)

## Principais Endpoints/Funcionalidades

A API segue princípios RESTful, com rotas públicas para autenticação e protegidas (JWT) para operações financeiras.

### Autenticação
- **POST /api/auth/register**
  - Corpo: `{ "nome": "string", "email": "string", "senha": "string" }`
  - Resposta: `{ "message": "Usuário criado com sucesso", "token": "jwt_token" }`
  - Cria usuário e gera categorias padrão.

- **POST /api/auth/login**
  - Corpo: `{ "email": "string", "senha": "string" }`
  - Resposta: `{ "token": "jwt_token", "user": { "id": number, "nome": "string" } }`
  - Autentica e retorna token JWT.

### Transações (Protegidas)
- **GET /api/transacoes**
  - Headers: `Authorization: Bearer <token>`
  - Resposta: Lista de transações do usuário.

- **POST /api/transacoes**
  - Headers: `Authorization: Bearer <token>`
  - Corpo: `{ "id_categoria": number, "data": "YYYY-MM-DD", "valor": number, "descricao": "string" }`
  - Resposta: Transação criada.

- **PUT /api/transacoes/:id**
  - Headers: `Authorization: Bearer <token>`
  - Corpo: Campos a atualizar.
  - Resposta: Transação atualizada.

- **DELETE /api/transacoes/:id**
  - Headers: `Authorization: Bearer <token>`
  - Resposta: Confirmação de exclusão.

### Categorias (Protegidas)
- **GET /api/categorias**
  - Headers: `Authorization: Bearer <token>`
  - Resposta: Lista de categorias do usuário.

- **POST /api/categorias**
  - Headers: `Authorization: Bearer <token>`
  - Corpo: `{ "nome": "string", "tipo": "Receita|Despesa" }`
  - Resposta: Categoria criada.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Neon.tech para PostgreSQL

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/dashboard-financeiro-projeto-pi.git
cd dashboard-financeiro-projeto-pi
```

### 2. Configurar o Backend
1. Navegue para a pasta backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do backend com:
   ```
   DB_HOST=seu_host_neon
   DB_PORT=5432
   DB_NAME=seu_banco
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   JWT_SECRET=sua_chave_secreta_jwt
   PORT=5000
   ```
4. Execute as migrações (se aplicável) e inicie o servidor:
   ```bash
   npm run dev
   ```

### 3. Configurar o Frontend
1. Em outro terminal, navegue para a pasta frontend:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 4. Acessar a Aplicação
- Frontend: http://localhost:5173 (porta padrão do Vite)
- Backend: http://localhost:5000

Para produção, configure Vercel para deploy automático.

## Otimização de Performance
- **Anti-Cold Start:** Requisição silenciosa para `/api/auth/health` no carregamento do login para "acordar" o banco Neon.
- **Estados de Loading:** Feedback visual em botões para evitar múltiplos cliques.

## Funcionalidades Adicionais
- **Modo Demo:** Botão no login para preencher dados de teste.
- **Semente Automática:** Categorias padrão criadas no cadastro.
- **Tema Dinâmico:** Alternância Light/Dark com ajuste automático nos gráficos.