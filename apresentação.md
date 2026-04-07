# Apresentação do Dashboard Financeiro Inteligente

## Funcionalidades Principais

### 1. Autenticação e Segurança
- **Registro e Login**: Usuários podem criar contas com e-mail e senha, com hash seguro usando Bcrypt.
- **JWT para Autenticação**: Tokens JWT garantem acesso seguro às rotas protegidas.
- **Isolamento de Dados**: Cada usuário vê apenas suas próprias transações e categorias.

#### Como Funciona a Lógica do Login
Exemplo detalhado, explicar do fluxo completo de autenticação desde o frontend até o backend:

##### Fluxo no Frontend (Login.jsx)
No arquivo `frontend/src/pages/Login.jsx`, o login é gerenciado através de um formulário React:

- **Estados**: `email`, `senha` e `loading` controlam os inputs e o estado de carregamento.
- **useEffect para Anti-Cold Start**: Ao carregar a página, uma requisição silenciosa é feita para `/auth/health` para "acordar" o banco Neon serverless:

```javascript
useEffect(() => {
  const acordarBanco = async () => {
    try {
      await api.get('/auth/health').catch(() => null);
    } catch (e) {}
  };
  acordarBanco();
}, []);
```

- **Função handleLogin**: Quando o formulário é submetido, a função faz uma requisição POST para `/auth/login`:

```javascript
const handleLogin = async (e) => {
  if (e) e.preventDefault();
  setLoading(true);
  try {
    const response = await api.post('/auth/login', { email, senha });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate('/dashboard');
  } catch (error) {
    alert(error?.response?.data?.message || 'Erro ao conectar.');
  } finally {
    setLoading(false);
  }
};
```

Se bem-sucedido, o token JWT e dados do usuário são salvos no localStorage, e o usuário é redirecionado para o dashboard.

##### Fluxo no Backend (usuarioController.js)
No arquivo `backend/src/controllers/usuarioController.js`, a função `login` processa a autenticação:

1. **Busca do Usuário**: O e-mail é usado para encontrar o usuário no banco PostgreSQL:
   ```javascript
   const usuario = await Usuario.findOne({ where: { email } });
   if (!usuario) {
     return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
   }
   ```

2. **Verificação da Senha**: A senha fornecida é comparada com o hash armazenado usando Bcrypt:
   ```javascript
   const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
   if (!senhaValida) {
     return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
   }
   ```

3. **Geração do Token JWT**: Se a senha for válida, um token é gerado com o ID do usuário:
   ```javascript
   const token = jwt.sign(
     { id: usuario.id_usuario }, 
     process.env.JWT_SECRET, 
     { expiresIn: '1d' }
   );
   ```

4. **Resposta**: O token e dados básicos do usuário são retornados:
   ```javascript
   res.json({
     message: 'Login realizado com sucesso!',
     token,
     user: { id: usuario.id_usuario, nome: usuario.nome }
   });
   ```

##### Middleware de Autenticação (authMiddleware.js)
Para rotas protegidas, o middleware verifica o token JWT:

```javascript
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Acesso negado.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido.' });
  }
};
```

Este middleware é usado em rotas como `/api/transacoes` e `/api/dashboard/resumo` para garantir que apenas usuários autenticados acessem seus dados.

**Em resumo**: O login combina hash seguro de senhas, tokens JWT para sessões stateless e isolamento de dados por usuário, criando um sistema seguro e escalável para autenticação em aplicações serverless.

### 2. Gestão de Transações
- **Adicionar, Editar e Excluir Transações**: Interface intuitiva para lançar entradas e saídas, com validação de dados.
- **Categorização**: Transações são organizadas por categorias (Receita ou Despesa), com possibilidade de criar novas categorias.
- **Busca e Filtragem**: Pesquisa por descrição e filtro por período de datas.

#### Como Funciona a Lógica das Categorias (categoriaController.js)
Exemplo detalhado, explicar como o backend gerencia as categorias através do `categoriaController.js`:

##### Função criarCategoria
Cria uma nova categoria ou reativa uma existente:

```javascript
exports.criarCategoria = async (req, res) => {
  try {
    let { nome, tipo } = req.body;
    const id_usuario = req.usuario.id; // Obtém do JWT via middleware
    
    // Formata o tipo (primeira letra maiúscula)
    if (tipo) {
      tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
    }

    // Verifica se já existe uma categoria com mesmo nome para o usuário
    const categoriaExistente = await Categoria.findOne({ where: { nome, id_usuario } });

    if (categoriaExistente) {
      if (categoriaExistente.status === 0) {
        // Reativa categoria excluída anteriormente
        categoriaExistente.status = 1;
        categoriaExistente.tipo = tipo;
        await categoriaExistente.save();
        return res.status(200).json(categoriaExistente);
      }
      return res.status(400).json({ error: 'Categoria já ativa.' });
    }

    // Cria nova categoria
    const nova = await Categoria.create({ 
      nome, 
      tipo, 
      id_usuario, 
      status: 1 
    });

    res.status(201).json(nova);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
};
```

**Características**:
- **Isolamento por usuário**: Usa `id_usuario` do token JWT.
- **Reativação**: Permite "excluir" e recriar categorias sem perder dados (soft delete com `status`).
- **Validação**: Evita duplicatas ativas.

##### Função listarCategorias
Retorna apenas categorias ativas do usuário logado:

```javascript
exports.listarCategorias = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const categorias = await Categoria.findAll({ 
      where: { id_usuario, status: 1 }, // Apenas ativas
      order: [['nome', 'ASC']] // Ordenadas alfabeticamente
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
};
```

##### Função editarCategoria
Atualiza nome e/ou tipo de uma categoria existente:

```javascript
exports.editarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tipo } = req.body;
    const id_usuario = req.usuario.id;

    const categoria = await Categoria.findOne({ where: { id_categoria: id, id_usuario } });

    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    if (tipo) {
      categoria.tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
    }
    
    categoria.nome = nome || categoria.nome;
    await categoria.save();

    res.json({ message: 'Categoria atualizada com sucesso!', categoria });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar categoria.' });
  }
};
```

##### Função deletarCategoria
Remove categoria através de soft delete (muda status para 0):

```javascript
exports.deletarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id;

    await Categoria.update(
      { status: 0 }, 
      { where: { id_categoria: id, id_usuario } }
    );

    res.json({ message: 'Categoria removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover categoria.' });
  }
};
```

**Em resumo**: O sistema de categorias usa soft delete para preservar integridade referencial, isolamento por usuário via JWT, e validações para evitar duplicatas. Isso permite flexibilidade na gestão sem comprometer a consistência dos dados de transações.

#### Como Funciona a Lógica das Transações (transacaoController.js)
Exemplo detalhado, explicar como o backend gerencia as transações através do `transacaoController.js`:

##### Função criarTransacao
Cria uma nova transação validando a categoria:

```javascript
exports.criarTransacao = async (req, res) => {
  try {
    const { valor, data, descricao, id_categoria } = req.body;
    const id_usuario = req.usuario.id;

    // Validar se a categoria existe e pertence ao usuário
    const categoria = await Categoria.findOne({ where: { id_categoria, id_usuario } });
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada ou não pertence ao usuário.' });
    }

    const novaTransacao = await Transacao.create({
      valor,
      data,
      descricao,
      id_categoria,
      id_usuario
    });

    res.status(201).json(novaTransacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar transação.' });
  }
};
```

**Características**:
- **Validação de categoria**: Garante que a categoria existe e pertence ao usuário logado.
- **Isolamento por usuário**: Todas as transações são vinculadas ao `id_usuario` do JWT.

##### Função listarTransacoes
Lista transações com filtros inteligentes:

```javascript
exports.listarTransacoes = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const { data_inicio, data_fim, busca } = req.query;

    let onde = { id_usuario };

    // PRIORIDADE: Se o usuário estiver buscando um texto, 
    // ignorar o filtro de data para facilitar a localização global.
    if (busca) {
      onde.descricao = { [Op.iLike]: `%${busca}%` };
    } 
    // Caso NÃO haja busca por texto, aplicar o filtro de data do calendário
    else if (data_inicio && data_fim) {
      onde.data = { [Op.between]: [data_inicio, data_fim] };
    }

    const transacoes = await Transacao.findAll({
      where: onde,
      include: [{ 
        model: Categoria, 
        as: 'categoria', 
        attributes: ['nome', 'tipo', 'status']
      }],
      order: [['data', 'DESC']]
    });

    res.json(transacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar transações.' });
  }
};
```

**Características**:
- **Filtro inteligente**: Busca por texto tem prioridade sobre filtro de data para facilitar localização.
- **Busca case-insensitive**: Usa `Op.iLike` para PostgreSQL.
- **Include de categoria**: Retorna dados da categoria relacionada.
- **Ordenação**: Transações mais recentes primeiro.

##### Função editarTransacao
Atualiza uma transação existente com validações:

```javascript
exports.editarTransacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, data, descricao, id_categoria } = req.body;
    const id_usuario = req.usuario.id;

    // Verifica se a transação pertence ao usuário
    const transacao = await Transacao.findOne({ where: { id_transacao: id, id_usuario } });

    if (!transacao) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    // Se o usuário estiver mudando a categoria, verifica se a nova categoria existe
    if (id_categoria) {
      const categoriaExistente = await Categoria.findOne({ where: { id_categoria, id_usuario } });
      if (!categoriaExistente) {
        return res.status(404).json({ error: 'Nova categoria não encontrada.' });
      }
    }

    // Atualiza os campos (mantém o original se o campo não for enviado)
    transacao.valor = valor || transacao.valor;
    transacao.data = data || transacao.data;
    transacao.descricao = descricao || transacao.descricao;
    transacao.id_categoria = id_categoria || transacao.id_categoria;

    await transacao.save();

    res.json({ message: 'Transação atualizada com sucesso!', transacao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar transação.' });
  }
};
```

##### Função deletarTransacao
Remove uma transação permanentemente:

```javascript
exports.deletarTransacao = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id;

    const deletado = await Transacao.destroy({
      where: { id_transacao: id, id_usuario }
    });

    if (!deletado) return res.status(404).json({ error: 'Transação não encontrada.' });

    res.json({ message: 'Transação removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover transação.' });
  }
};
```

**Em resumo**: O controlador de transações implementa isolamento rigoroso por usuário, validações de categoria, filtros inteligentes que priorizam busca textual sobre datas, e operações CRUD completas. A lógica de filtros no backend complementa perfeitamente o sistema de filtros do frontend, garantindo consistência nos dados exibidos.

### 3. Visualização de Dados
- **Gráficos Interativos**: Utiliza MUI X Charts para gráficos de pizza (distribuição por categoria), barras (gastos diários) e comparações (entradas vs saídas).
- **Cards de Resumo**: Exibe saldo total, entradas e saídas em tempo real.
- **Tema Dinâmico**: Alternância entre modo claro e escuro, ajustando automaticamente os gráficos.

### 4. Filtros e Atualização em Tempo Real
Exemplo detalhado, explicar como funciona o sistema de filtros e a atualização imediata dos gráficos:

#### Como o Filtro Funciona no Código
No arquivo `frontend/src/pages/Dashboard.jsx`, o filtro é implementado através de um estado React chamado `filtros`, que contém:
- `data_inicio`: Data de início do período
- `data_fim`: Data de fim do período  
- `busca`: Texto para pesquisa por descrição

Cada input de filtro está conectado a este estado:
- Input de data início: `onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}`
- Input de data fim: `onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}`
- Input de busca: `onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}`

#### O que Aciona a Atualização dos Gráficos
Existe um `useEffect` que monitora mudanças no estado `filtros`:

```javascript
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    carregarDados();
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [filtros]);
```

Quando `filtros` muda, após 500ms (debounce para evitar requisições excessivas), a função `carregarDados()` é chamada.

#### Como os Dados São Carregados
A função `carregarDados()` monta parâmetros da URL e faz requisições à API:

```javascript
const params = new URLSearchParams();
if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
if (filtros.busca) params.append('busca', filtros.busca);

const [resResumo, resLista, resCats] = await Promise.all([
  api.get(`/dashboard/resumo?${params.toString()}`), 
  api.get(`/transacoes?${params.toString()}`),
  api.get('/categorias')
]);
      
setResumo(resResumo.data);
setTransacoes(resLista.data);
setCategorias(resCats.data);
```

#### Por que o Gráfico Muda Imediatamente
O componente `DashboardCharts` recebe a prop `transacoes`:

```jsx
<DashboardCharts transacoes={transacoes} />
```

Dentro de `DashboardCharts.jsx`, os gráficos são calculados usando `useMemo` baseado no estado `transacoes`:

- `despesasPorCategoria`: Distribuição por categoria de despesas
- `dadosEvolucaoBarras`: Gastos diários em formato de barras
- `totalEntradas` e `totalSaidas`: Totais para comparação

Quando `transacoes` é atualizado pela API filtrada, os `useMemo` recalculam automaticamente os dados dos gráficos, fazendo com que eles sejam redesenhados em tempo real.

**Em resumo**: O gráfico não tem filtro próprio. Ele acompanha automaticamente a mesma lista de transações que a tabela e o resumo, porque todos usam o mesmo estado `transacoes`. Isso cria uma experiência fluida onde filtro, tabela e gráficos estão sempre sincronizados.

---

### Como Funciona a Estrutura de Tabelas do Banco de Dados
Exemplo detalhado, explicando como as tabelas do banco de dados foram estruturadas, seus relacionamentos e como foram criadas usando Sequelize ORM, incluindo o script SQL equivalente.

##### Estrutura Geral das Tabelas
O banco de dados PostgreSQL (hospedado no Neon.tech) utiliza três tabelas principais para gerenciar usuários, categorias e transações. Todas as tabelas seguem princípios de isolamento por usuário, com chaves estrangeiras para garantir integridade referencial:

- **usuarios**: Armazena dados dos usuários (nome, email, senha criptografada).
- **categorias**: Categorias de transações (Receita ou Despesa), vinculadas a um usuário específico.
- **transacoes**: Registros financeiros, vinculados a um usuário e uma categoria.

##### Relacionamentos
- Um usuário pode ter múltiplas categorias e transações (1:N).
- Uma categoria pertence a um usuário e pode ter múltiplas transações (1:N).
- Uma transação pertence a um usuário e uma categoria (N:1 para ambos).

Isso garante isolamento de dados: cada usuário vê apenas suas próprias categorias e transações.

##### Como as Tabelas Foram Criadas
As tabelas são definidas através de modelos Sequelize no backend (`backend/src/models/`), que abstraem a criação e manipulação do banco. No ambiente local, as tabelas são sincronizadas automaticamente ao iniciar o servidor usando `sequelize.sync({ alter: true })` (linha 56 em `server.js`), que cria ou altera as tabelas conforme os modelos. Em produção (Vercel), o Neon gerencia a persistência, mas os modelos garantem a estrutura.

**Exemplo de Sincronização no Código** (`backend/server.js`):
```javascript
const startServer = async () => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      await sequelize.sync({ alter: true }); // Cria/altera tabelas automaticamente
      console.log('✅ Tabelas sincronizadas localmente.');
      // ...
    }
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor local:", error);
  }
};
```

Isso evita a necessidade de migrations manuais, facilitando o desenvolvimento.

##### Script SQL Equivalente
Abaixo, o script SQL que representa a estrutura criada pelos modelos Sequelize. Este script pode ser executado diretamente no PostgreSQL para criar as tabelas manualmente (útil para debugging ou migração):

```sql
-- Tabela de usuários
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE categorias (
  id_categoria SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  tipo ENUM('Receita', 'Despesa') NOT NULL,
  id_usuario INTEGER NOT NULL,
  status INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabela de transações
CREATE TABLE transacoes (
  id_transacao SERIAL PRIMARY KEY,
  valor DECIMAL(10,2) NOT NULL,
  data DATE NOT NULL,
  descricao VARCHAR(255),
  id_usuario INTEGER NOT NULL,
  id_categoria INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
);
```

**Notas sobre o Script**:
- `SERIAL`: Tipo PostgreSQL para auto-incremento (equivalente a INTEGER AUTO_INCREMENT).
- `ENUM`: Tipo personalizado para restringir valores em 'tipo'.
- `ON DELETE CASCADE`: Remove registros relacionados automaticamente (ex.: deletar usuário remove suas categorias e transações).
- Timestamps (`createdAt`, `updatedAt`): Adicionados automaticamente pelo Sequelize quando `timestamps: true`.

**Em resumo**: A estrutura usa relacionamentos 1:N para isolamento por usuário, com Sequelize gerenciando a criação/alteração automática das tabelas. Isso permite escalabilidade e consistência, com o script SQL servindo como referência para a estrutura subjacente no PostgreSQL.

---

### 5. Anti-Cold Start
- Requisição silenciosa para `/api/auth/health` no carregamento do login para "acordar" o banco Neon serverless e evitar latências.

### 6. Interface Responsiva
- Design adaptável para desktop e mobile, com componentes reutilizáveis em React.

## Tecnologias Utilizadas

### Frontend
- **React.js (Vite)**: Framework para interfaces dinâmicas e rápidas.
- **Tailwind CSS**: Estilização utilitária e temas (Light/Dark).
- **MUI X Charts**: Biblioteca para gráficos interativos.
- **Lucide React**: Ícones leves.
- **Axios**: Cliente HTTP com interceptores para autenticação.

### Backend
- **Node.js & Express**: Servidor web escalável.
- **JWT**: Autenticação stateless.
- **Bcrypt.js**: Hash de senhas.
- **Sequelize**: ORM para PostgreSQL.

### Banco de Dados
- **PostgreSQL (Neon.tech)**: Banco relacional serverless.

### Infraestrutura
- **Vercel**: Hospedagem para frontend e backend.

## Arquitetura
O projeto usa arquitetura monolítica com separação clara entre frontend e backend, ambos hospedados em Vercel para escalabilidade. O backend fornece APIs RESTful, enquanto o frontend consome esses dados para renderizar a interface.

