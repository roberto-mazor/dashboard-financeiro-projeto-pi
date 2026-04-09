### Rotas Públicas e Protegidas

Link API = https://dashboard-financeiro-projeto-pi-bac.vercel.app/api/

---

### 1. Autenticação (Rotas Públicas)

**POST** `/api/auth/register` (Criar Conta)
```json
{
  "nome": "Recrutador",
  "email": "recrutador@demo.com",
  "senha": "123456"
}
```

**POST** `/api/auth/login` (Acessar)
```json
{
  "email": "recrutador@demo.com",
  "senha": "Recrut@Dash2026"
}
```
> **Nota:** Ao fazer o login, copie o `token` recebido na resposta. Você precisará dele para as próximas rotas.

---

### 2. Configuração do Thunder Client (Rotas Protegidas)

Para todas as rotas abaixo, ir na aba **Auth** do Thunder Client, selecionar **Bearer Token** e colar o token que você copiou no login.

---

### 3. Categorias (Rotas Protegidas)

**POST** `/api/categorias` (Criar Categoria)
```json
{
  "nome": "Alimentação",
  "tipo": "Despesa"
}
```

**PUT** `/api/categorias/:id` (Editar Categoria)
*Substitua `:id` pelo ID real da categoria na URL.*
```json
{
  "nome": "Supermercado",
  "tipo": "Despesa"
}
```

---

### 4. Transações (Rotas Protegidas)

**POST** `/api/transacoes` (Criar Transação)
```json
{
  "valor": 150.50,
  "data": "2026-04-09",
  "descricao": "Compras do mês",
  "id_categoria": 1
}
```

**PUT** `/api/transacoes/:id` (Editar Transação)
```json
{
  "valor": 160.00,
  "descricao": "Compras do mês (ajuste de valor)"
}
```

---

### 5. Dashboard e Filtros (Rotas Protegidas)

Para as rotas de listagem e resumo, você não envia um JSON no corpo, mas sim **Query Parameters** (parâmetros na URL). No Thunder Client, use a aba **Query**:

**GET** `/api/dashboard/resumo`
* `data_inicio`: `2026-04-01`
* `data_fim`: `2026-04-30`

**GET** `/api/transacoes` (Listagem com busca)
* `busca`: `Aluguel`
* `data_inicio`: `2026-01-01`
* `data_fim`: `2026-12-31`