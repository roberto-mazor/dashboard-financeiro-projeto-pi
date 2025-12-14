# dashboard-financeiro-projeto-pi

# 📄 Documentação do Projeto: Dashboard Financeiro Pessoal

## I. Visão Geral do Projeto

Este projeto visa a criação de um Dashboard Financeiro Pessoal completo para portfólio, focado em demonstrar proficiência em análise de dados, visualização e arquitetura Full Stack.

| Item | Descrição | 
 | ----- | ----- | 
| **Objetivo** | Criar um Dashboard Financeiro Pessoal para portfólio, demonstrando análise de dados, visualização e arquitetura Full Stack. | 
| **Frontend Stack** | React (com Vite), Material UI (MUI) para componentes estruturais, Tailwind CSS para estilização e customização. | 
| **Backend Stack** | Node.js/Express, SQL (a ser definido, ex: PostgreSQL/MySQL), ORM (ex: Sequelize) para abstração do DB. | 
| **Arquitetura Backend** | MVC (Model-View-Controller) com rotas protegidas por JSON Web Tokens (JWT) para autenticação segura. | 

## II. Estrutura de Rotas (Frontend & Backend)

| Rota (URL) | Tipo (HTTP) | Descrição da Rota | Backend Controller | Protegido? | 
 | ----- | ----- | ----- | ----- | ----- | 
| `/api/auth/cadastro` | POST | Cria um novo usuário (Usuarios). | `usuarioController.cadastro` | Não | 
| `/api/auth/login` | POST | Autentica e retorna um Token JWT. | `usuarioController.login` | Não | 
| `/dashboard` | GET (FE) | Tela principal, resumo de saldo e fluxo. | N/A (Frontend Render) | Sim | 
| `/transacoes` | GET (FE) | Tela de gestão de lançamentos. | N/A (Frontend Render) | Sim | 
| `/api/transacoes` | GET/POST/PUT/DELETE | CRUD de lançamentos financeiros. | `transacaoController` | Sim | 
| `/api/categorias` | GET/POST | CRUD de categorias de Receita/Despesa. | `categoriaController` | Sim | 
| `/orcamento` | GET (FE) | Tela de acompanhamento de orçamento. | N/A (Frontend Render) | Sim | 
| `/api/orcamento` | GET/POST/PUT | CRUD de limites de orçamento mensais. | `orcamentoController` | Sim | 

## III. Backend (Node.js/Express/SQL)

### A. Estrutura de Diretórios

| Diretório | Função | Exemplo de Arquivo Chave | 
 | ----- | ----- | ----- | 
| `server.js` | Inicialização do Servidor, Middlewares globais. | `const app = express();` | 
| `src/config` | Configurações de terceiros. | `db.js` (conexão SQL e ORM) | 
| `src/models` | Mapeamento das tabelas SQL (Schemas ORM). | `Transacao.js`, `Usuario.js` | 
| `src/routes` | Define as URLs e direciona para os Controllers. | `transacaoRoutes.js` | 
| `src/controllers` | Lógica da requisição (recebe req, chama models, envia res). | `usuarioController.js` | 
| `src/middleware` | Funções executadas antes dos Controllers. | `authMiddleware.js` (Verifica JWT) | 
| `.env` | Armazena variáveis sensíveis (porta, credenciais do DB, chave JWT). | `DB_USER=root` | 

### B. Modelos de Dados SQL (Tabelas Principais)

| Tabela | Chave Primária | Relações (Foreign Keys) | Campos Chaves | 
 | ----- | ----- | ----- | ----- | 
| `Usuarios` | `id_usuario` | N/A | `email`, `senha_hash`, `nome` | 
| `Contas` | `id_conta` | `id_usuario` | `nome`, `saldo_inicial` | 
| `Categorias` | `id_categoria` | `id_usuario` | `nome`, `tipo` (Receita/Despesa) | 
| `Transacoes` | `id_transacao` | `id_usuario`, `id_categoria`, `id_conta` | `data`, `valor`, `descricao` | 
| `Orcamentos` | `id_orcamento` | `id_usuario`, `id_categoria` | `mes_ano`, `valor_orcado` | 

## IV. Frontend (React/MUI/Tailwind)

### A. Componentes e Bibliotecas Principais

| Componente | Função | Tecnologia | 
 | ----- | ----- | ----- | 
| Layout | Estrutura principal: Sidebar (Menu), Header. | React, MUI (`Drawer`, `AppBar`) | 
| Autenticação | Telas de Login/Cadastro/Recuperar. | React, Tailwind CSS | 
| Gráficos | Renderização de dados financeiros (linha, pizza). | Recharts ou Chart.js (com wrapper React) | 
| Tabelas | Exibição e filtragem de transações. | MUI (`Table`, `DataGrid`) | 
| Formulários | Adição e edição de transações. | React, MUI (`TextField`, `DatePicker`) | 

### B. Configuração de Estilo (MUI + Tailwind)

1. **Instalação:** Instalar `tailwindcss`, `@mui/material`, `emotion`.

2. **Conflito:** No arquivo principal (ex: `App.jsx`), utilizar o componente `<StyledEngineProvider injectFirst>` do MUI para garantir que as classes Tailwind tenham precedência sobre os estilos padrão do Material UI, permitindo a customização visual.

## 🚀 Próximas Etapas (Ordem de Implementação Sugerida)

Sugiro a seguinte ordem para construir o projeto de forma lógica:

1. **Configuração de Ambiente:** Configurar o projeto React/Vite e Node/Express. Instalar o ORM e bibliotecas iniciais.

2. **Banco de Dados & ORM:** Criar as tabelas SQL e definir os models no ORM (`src/models`).

3. **Autenticação (Backend):** Implementar as rotas `/api/auth/cadastro` e `/api/auth/login`. Criar o `authMiddleware.js` para proteger rotas.

4. **Autenticação (Frontend):** Criar as telas de Login/Cadastro e implementar a lógica de armazenamento de JWT.

5. **CRUD Básico (Backend):** Implementar o CRUD completo para a tabela `Transacoes`.

6. **Layout (Frontend):** Construir o Layout Principal, a Sidebar de navegação e as telas vazias das rotas protegidas (`/dashboard`, `/transacoes`).

7. **Dashboard Principal:** Integrar a leitura de transações (GET) e exibir os primeiros gráficos e resumos.