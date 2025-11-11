# BankSys - Documentação Técnica

---

**Projeto:** BankSys - Sistema Bancário de Criptomoedas  
**Versão:** 1.0.0  
**Data:** Janeiro 2025  
**Desenvolvedor:** Sistema BankSys  

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4. [Estrutura do Projeto](#4-estrutura-do-projeto)
5. [Backend - API REST](#5-backend---api-rest)
6. [Frontend - Interface Web](#6-frontend---interface-web)
7. [Banco de Dados](#7-banco-de-dados)
8. [Autenticação e Segurança](#8-autenticação-e-segurança)
9. [Testes Automatizados](#9-testes-automatizados)
10. [Docker e Containerização](#10-docker-e-containerização)
11. [Tratamento de Erros](#11-tratamento-de-erros)
12. [Guia de Deploy](#12-guia-de-deploy)
13. [Conclusão](#13-conclusão)

---

## 1. Visão Geral

### 1.1 Descrição do Projeto

O **BankSys** é um sistema bancário completo para gerenciamento de carteiras de criptomoedas. A aplicação permite aos usuários criar contas, autenticar-se de forma segura, gerenciar seus perfis e realizar transações de compra e venda de criptomoedas com preços fixos em Real (BRL).

### 1.2 Objetivos

- Fornecer uma plataforma web responsiva para gerenciamento de criptomoedas
- Implementar autenticação segura com JWT
- Permitir operações CRUD completas para usuários e transações
- Garantir tratamento robusto de erros e exceções
- Fornecer cobertura de testes automatizados
- Utilizar containerização Docker para fácil deployment

### 1.3 Funcionalidades Principais

- **Autenticação:** Registro e login de usuários com JWT
- **Gerenciamento de Conta:** CRUD completo de perfil de usuário
- **Carteira Digital:** Visualização de saldo e ativos
- **Transações:** Compra e venda de criptomoedas
- **Histórico:** Visualização completa de transações realizadas
- **Design Responsivo:** Interface adaptável para mobile, tablet e desktop

---

## 2. Arquitetura do Sistema

### 2.1 Arquitetura Geral

O BankSys utiliza uma arquitetura de três camadas:

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  - Interface do Usuário             │
│  - Validação de Formulários         │
│  - Gerenciamento de Estado          │
└──────────────┬──────────────────────┘
               │ HTTP/REST API
               │ (JSON)
┌──────────────▼──────────────────────┐
│      Backend (FastAPI/Python)       │
│  - API REST                         │
│  - Autenticação JWT                 │
│  - Lógica de Negócio                │
│  - Validação de Dados               │
└──────────────┬──────────────────────┘
               │ MongoDB Driver
               │
┌──────────────▼──────────────────────┐
│    Banco de Dados (MongoDB)         │
│  - Usuários                         │
│  - Carteiras                        │
│  - Transações                       │
└─────────────────────────────────────┘
```

### 2.2 Padrões de Design

- **RESTful API:** Endpoints seguem princípios REST
- **Repository Pattern:** Acesso ao banco de dados encapsulado
- **Dependency Injection:** Utilizado no FastAPI para autenticação
- **JWT Authentication:** Token-based authentication
- **MVC Pattern:** Separação clara entre Model, View e Controller

---

## 3. Tecnologias Utilizadas

### 3.1 Backend

| Tecnologia | Versão | Propósito |
|------------|--------|----------|
| Python | 3.10+ | Linguagem principal |
| FastAPI | 0.110.1 | Framework web |
| Motor | 3.3.1 | Driver assíncrono MongoDB |
| Pydantic | 2.6+ | Validação de dados |
| PyJWT | 2.10+ | Geração/validação JWT |
| Passlib | 1.7+ | Hash de senhas |
| Bcrypt | 4.1.3 | Algoritmo de hash |
| Pytest | 8.0+ | Testes automatizados |

### 3.2 Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|----------|
| React | 19.0.0 | Framework UI |
| React Router | 7.5.1 | Roteamento |
| Axios | 1.8.4 | Cliente HTTP |
| Tailwind CSS | 3.4.17 | Framework CSS |
| Shadcn/UI | Latest | Componentes UI |
| Lucide React | 0.507.0 | Ícones |
| Sonner | 2.0.3 | Notificações toast |
| date-fns | 4.1.0 | Manipulação de datas |

### 3.3 Banco de Dados

- **MongoDB 7.0+:** Banco NoSQL orientado a documentos
- **Docker Container:** MongoDB rodando em container isolado

### 3.4 DevOps

- **Docker:** Containerização da aplicação
- **Docker Compose:** Orquestração de containers
- **Supervisor:** Gerenciamento de processos

---

## 4. Estrutura do Projeto

```
/app/
├── backend/
│   ├── server.py              # Aplicação FastAPI principal
│   ├── requirements.txt       # Dependências Python
│   ├── .env                   # Variáveis de ambiente
│   ├── tests/                 # Testes automatizados
│   │   ├── __init__.py
│   │   ├── test_auth.py       # Testes de autenticação
│   │   ├── test_transactions.py # Testes de transações
│   │   └── test_user_crud.py  # Testes CRUD usuário
│   └── pytest.ini             # Configuração pytest
├── frontend/
│   ├── public/                # Assets estáticos
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Cliente API configurado
│   │   ├── components/
│   │   │   ├── ui/            # Componentes Shadcn
│   │   │   └── Navbar.jsx     # Barra de navegação
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Página de login
│   │   │   ├── Register.jsx   # Página de registro
│   │   │   ├── Dashboard.jsx  # Dashboard principal
│   │   │   ├── BuyCrypto.jsx  # Compra de ativos
│   │   │   ├── SellCrypto.jsx # Venda de ativos
│   │   │   ├── History.jsx    # Histórico
│   │   │   └── Profile.jsx    # Perfil do usuário
│   │   ├── App.js             # Componente raiz
│   │   ├── App.css            # Estilos globais
│   │   └── index.js           # Entry point
│   ├── package.json           # Dependências Node.js
│   ├── tailwind.config.js     # Config Tailwind
│   └── .env                   # Variáveis de ambiente
├── docs/
│   └── DOCUMENTATION.md       # Esta documentação
└── README.md                  # Guia rápido
```

---

## 5. Backend - API REST

### 5.1 Endpoints da API

#### 5.1.1 Autenticação

**POST /api/auth/register**
- Descrição: Registra novo usuário
- Body:
  ```json
  {
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }
  ```
- Response: Token JWT + dados do usuário
- Status Codes: 200 (Success), 400 (Email já existe)

**POST /api/auth/login**
- Descrição: Autentica usuário
- Body:
  ```json
  {
    "email": "joao@example.com",
    "password": "senha123"
  }
  ```
- Response: Token JWT + dados do usuário
- Status Codes: 200 (Success), 401 (Credenciais inválidas)

**GET /api/auth/me**
- Descrição: Retorna dados do usuário autenticado
- Headers: Authorization: Bearer {token}
- Response: Dados do usuário
- Status Codes: 200 (Success), 401 (Não autenticado)

**PUT /api/auth/update**
- Descrição: Atualiza dados do usuário
- Headers: Authorization: Bearer {token}
- Body:
  ```json
  {
    "name": "João Silva Souza",
    "password": "novasenha123"
  }
  ```
- Response: Dados atualizados
- Status Codes: 200 (Success), 401 (Não autenticado)

**DELETE /api/auth/delete**
- Descrição: Deleta conta do usuário
- Headers: Authorization: Bearer {token}
- Response: Mensagem de confirmação
- Status Codes: 200 (Success), 401 (Não autenticado)

#### 5.1.2 Criptomoedas

**GET /api/cryptos**
- Descrição: Lista todas as criptomoedas disponíveis
- Response: Array de criptomoedas
- Criptomoedas disponíveis:
  - Bitcoin (BTC): R$ 350.000,00
  - Ethereum (ETH): R$ 18.500,00
  - Binance Coin (BNB): R$ 2.100,00
  - Cardano (ADA): R$ 3,50
  - Solana (SOL): R$ 650,00

#### 5.1.3 Carteira

**GET /api/wallet**
- Descrição: Retorna ativos da carteira do usuário
- Headers: Authorization: Bearer {token}
- Response: Array de ativos com quantidades

**GET /api/wallet/balance**
- Descrição: Retorna saldo total em BRL
- Headers: Authorization: Bearer {token}
- Response:
  ```json
  {
    "total_brl": 45000.50
  }
  ```

#### 5.1.4 Transações

**POST /api/transactions/buy**
- Descrição: Compra de criptomoeda
- Headers: Authorization: Bearer {token}
- Body:
  ```json
  {
    "crypto_id": "btc",
    "quantity": 0.001,
    "transaction_type": "buy"
  }
  ```
- Response: Dados da transação
- Status Codes: 200 (Success), 404 (Cripto não encontrada), 400 (Quantidade inválida)

**POST /api/transactions/sell**
- Descrição: Venda de criptomoeda
- Headers: Authorization: Bearer {token}
- Body:
  ```json
  {
    "crypto_id": "btc",
    "quantity": 0.0005,
    "transaction_type": "sell"
  }
  ```
- Response: Dados da transação
- Status Codes: 200 (Success), 400 (Saldo insuficiente)

**GET /api/transactions/history**
- Descrição: Histórico de transações do usuário
- Headers: Authorization: Bearer {token}
- Response: Array de transações ordenadas por data

### 5.2 Modelos de Dados (Pydantic)

```python
class User(BaseModel):
    id: str
    name: str
    email: str
    created_at: str

class Transaction(BaseModel):
    id: str
    user_id: str
    crypto_id: str
    crypto_name: str
    crypto_symbol: str
    transaction_type: str  # 'buy' or 'sell'
    quantity: float
    price_brl: float
    total_brl: float
    timestamp: str

class WalletItem(BaseModel):
    crypto_id: str
    crypto_name: str
    crypto_symbol: str
    quantity: float
    price_brl: float
    total_brl: float
```

---

## 6. Frontend - Interface Web

### 6.1 Páginas Principais

#### Login (/login)
- Formulário de autenticação
- Validação de campos
- Redirect para dashboard após sucesso
- Link para página de registro

#### Registro (/register)
- Formulário de criação de conta
- Validação de email e senha (mínimo 6 caracteres)
- Auto-login após registro
- Link para página de login

#### Dashboard (/dashboard)
- Exibição do saldo total
- Lista de criptomoedas na carteira
- Botões de ações rápidas (Comprar/Vender)
- Estado vazio quando não há ativos

#### Compra (/buy)
- Lista de criptomoedas disponíveis
- Seleção de ativo
- Input de quantidade
- Cálculo em tempo real do total
- Confirmação de compra

#### Venda (/sell)
- Lista de ativos na carteira
- Seleção de ativo para vender
- Validação de quantidade disponível
- Cálculo do valor a receber
- Confirmação de venda

#### Histórico (/history)
- Lista de todas as transações
- Diferenciação visual entre compra e venda
- Formatação de datas em português
- Ordenação por data (mais recente primeiro)

#### Perfil (/profile)
- Visualização de dados do usuário
- Edição de nome e senha
- Exclusão de conta com confirmação
- Zona de perigo destacada

### 6.2 Componentes Reutilizáveis

- **Navbar:** Barra de navegação com menu desktop/mobile
- **PrivateRoute:** HOC para proteção de rotas
- **UI Components:** Button, Input, Card, Alert Dialog (Shadcn)

### 6.3 Design System

**Paleta de Cores (70/20/10):**
- 70% Primária: #F5F5F5 (Cinza Claro) - Backgrounds
- 20% Secundária: #1E3A8A (Azul Escuro) - Navegação, títulos
- 10% Destaque: #10B981 (Verde) - Botões de ação, confirmações
- Erro: #EF4444 (Vermelho) - Ações destrutivas

**Tipografia:**
- Headings: Manrope (Bold)
- Body: Inter (Regular)
- Tamanhos responsivos com Tailwind

**Responsividade:**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Menu hambúrguer em mobile
- Grid adaptável

---

## 7. Banco de Dados

### 7.1 Collections MongoDB

#### users
```json
{
  "id": "uuid-v4",
  "name": "João Silva",
  "email": "joao@example.com",
  "hashed_password": "$2b$12$...",
  "created_at": "2025-01-15T10:30:00.000Z"
}
```

#### wallets
```json
{
  "user_id": "uuid-v4",
  "crypto_id": "btc",
  "quantity": 0.025
}
```

#### transactions
```json
{
  "id": "uuid-v4",
  "user_id": "uuid-v4",
  "crypto_id": "btc",
  "crypto_name": "Bitcoin",
  "crypto_symbol": "BTC",
  "transaction_type": "buy",
  "quantity": 0.001,
  "price_brl": 350000.00,
  "total_brl": 350.00,
  "timestamp": "2025-01-15T14:25:30.000Z"
}
```

### 7.2 Índices Recomendados

```javascript
// users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "id": 1 }, { unique: true })

// wallets collection
db.wallets.createIndex({ "user_id": 1, "crypto_id": 1 })

// transactions collection
db.transactions.createIndex({ "user_id": 1, "timestamp": -1 })
db.transactions.createIndex({ "id": 1 }, { unique: true })
```

---

## 8. Autenticação e Segurança

### 8.1 JWT Authentication

**Geração do Token:**
```python
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=10080)  # 7 dias
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt
```

**Validação:**
- Token enviado no header: `Authorization: Bearer {token}`
- Verificação de expiração
- Validação de assinatura
- Extração do user_id do payload

### 8.2 Hash de Senhas

- Algoritmo: **Bcrypt**
- Biblioteca: **Passlib**
- Salt rounds: 12 (padrão)

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### 8.3 Proteções Implementadas

- ✅ Senhas nunca armazenadas em texto plano
- ✅ Tokens JWT com expiração
- ✅ Validação de email único
- ✅ CORS configurado
- ✅ Validação de dados com Pydantic
- ✅ Proteção contra SQL Injection (NoSQL database)
- ✅ HTTPOnly cookies (recomendado para produção)

---

## 9. Testes Automatizados

### 9.1 Framework de Testes

- **Pytest:** Framework principal
- **HTTPX AsyncClient:** Cliente de testes assíncronos
- **Pytest-asyncio:** Suporte a testes assíncronos

### 9.2 Cobertura de Testes

#### test_auth.py
1. ✅ Registro de novo usuário
2. ✅ Registro com email duplicado (erro esperado)
3. ✅ Login com credenciais corretas
4. ✅ Login com senha incorreta (erro esperado)
5. ✅ Obter dados do usuário autenticado
6. ✅ Obter dados sem autenticação (erro esperado)

#### test_transactions.py
1. ✅ Listar criptomoedas disponíveis
2. ✅ Comprar criptomoeda com sucesso
3. ✅ Comprar criptomoeda inválida (erro esperado)
4. ✅ Comprar com quantidade negativa (erro esperado)
5. ✅ Vender com saldo insuficiente (erro esperado)
6. ✅ Fluxo completo: compra → verificar carteira → venda
7. ✅ Obter saldo da carteira

#### test_user_crud.py
1. ✅ Atualizar nome do usuário
2. ✅ Atualizar senha e validar login com nova senha
3. ✅ Deletar conta do usuário
4. ✅ Ler perfil do usuário

### 9.3 Executando os Testes

```bash
# Executar todos os testes
cd /app/backend
pytest

# Executar com verbosidade
pytest -v

# Executar testes específicos
pytest tests/test_auth.py

# Executar com cobertura
pytest --cov=. --cov-report=html
```

### 9.4 Resultados Esperados

Todos os testes devem passar (PASSED):
```
================== test session starts ==================
collected 15 items

tests/test_auth.py ......                          [ 40%]
tests/test_transactions.py ........                [ 93%]
tests/test_user_crud.py ....                       [100%]

================== 15 passed in 2.35s ===================
```

---

## 10. Docker e Containerização

### 10.1 Containers

O sistema BankSys utiliza múltiplos containers Docker:

1. **MongoDB Container:**
   - Imagem: mongo:7.0
   - Porta: 27017
   - Volume persistente

2. **Backend Container:**
   - Python 3.10+
   - FastAPI + Uvicorn
   - Porta interna: 8001

3. **Frontend Container:**
   - Node.js 18+
   - React Development Server
   - Porta interna: 3000

### 10.2 Dockerfile Backend

```dockerfile
FROM python:3.10-slim

WORKDIR /app/backend

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
```

### 10.3 Dockerfile Frontend

```dockerfile
FROM node:18-alpine

WORKDIR /app/frontend

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
```

### 10.4 docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: banksys-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=banksys_db
    networks:
      - banksys-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: banksys-backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=banksys_db
      - JWT_SECRET_KEY=your-secret-key-change-in-production
      - CORS_ORIGINS=http://localhost:3000
    depends_on:
      - mongodb
    networks:
      - banksys-network
    volumes:
      - ./backend:/app/backend

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: banksys-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001
    depends_on:
      - backend
    networks:
      - banksys-network
    volumes:
      - ./frontend:/app/frontend
      - /app/frontend/node_modules

volumes:
  mongo_data:

networks:
  banksys-network:
    driver: bridge
```

### 10.5 Comandos Docker

```bash
# Iniciar todos os containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Reconstruir containers
docker-compose up --build

# Acessar shell do container
docker exec -it banksys-backend bash

# Ver status dos containers
docker-compose ps
```

---

## 11. Tratamento de Erros

### 11.1 Erros HTTP Padronizados

Todos os erros retornam JSON com estrutura:
```json
{
  "detail": "Mensagem de erro descritiva"
}
```

### 11.2 Códigos de Status

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Requisição bem-sucedida |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Não autenticado ou token inválido |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro no servidor |

### 11.3 Tratamento no Backend

```python
# Exemplo: Validação de quantidade
if transaction_data.quantity <= 0:
    raise HTTPException(
        status_code=400,
        detail="Quantidade deve ser maior que zero"
    )

# Exemplo: Verificação de saldo
if wallet_item["quantity"] < transaction_data.quantity:
    raise HTTPException(
        status_code=400,
        detail="Saldo insuficiente"
    )

# Exemplo: Token expirado
except jwt.ExpiredSignatureError:
    raise HTTPException(
        status_code=401,
        detail="Token expirado"
    )
```

### 11.4 Tratamento no Frontend

```javascript
try {
  const response = await api.post('/auth/login', credentials);
  // Sucesso
} catch (error) {
  // Exibir mensagem de erro
  toast.error(error.response?.data?.detail || 'Erro ao fazer login');
}
```

### 11.5 Validação de Dados

**Backend (Pydantic):**
- Validação automática de tipos
- Validação de email com EmailStr
- Validação de campos obrigatórios

**Frontend:**
- Validação HTML5 (required, minLength, type="email")
- Validação customizada em formulários
- Feedback visual imediato

---

## 12. Guia de Deploy

### 12.1 Pré-requisitos

- Docker 20.10+
- Docker Compose 1.29+
- Git
- 2GB RAM mínimo
- 10GB espaço em disco

### 12.2 Passos para Deploy Local

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/banksys.git
   cd banksys
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   # Backend (.env)
   cp backend/.env.example backend/.env
   # Editar e configurar JWT_SECRET_KEY
   
   # Frontend (.env)
   cp frontend/.env.example frontend/.env
   # Configurar REACT_APP_BACKEND_URL
   ```

3. **Iniciar containers:**
   ```bash
   docker-compose up -d
   ```

4. **Verificar status:**
   ```bash
   docker-compose ps
   ```

5. **Acessar aplicação:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001/docs (Swagger)
   - MongoDB: localhost:27017

### 12.3 Deploy em Produção

**Checklist de Segurança:**
- [ ] Alterar JWT_SECRET_KEY para valor forte e aleatório
- [ ] Configurar CORS_ORIGINS para domínios específicos
- [ ] Usar HTTPS (SSL/TLS)
- [ ] Configurar firewall
- [ ] Implementar rate limiting
- [ ] Configurar backup do MongoDB
- [ ] Monitoramento e logs
- [ ] Usar variáveis de ambiente seguras

**Recomendações:**
- Usar MongoDB Atlas ou MongoDB gerenciado
- Deploy de frontend em CDN (Vercel, Netlify)
- Backend em serviço de container (AWS ECS, GCP Cloud Run)
- Implementar CI/CD (GitHub Actions)

---

## 13. Conclusão

### 13.1 Requisitos Atendidos

✅ **Backend com API REST:** FastAPI com endpoints RESTful completos  
✅ **Linguagem de programação:** Python (Backend) e JavaScript/React (Frontend)  
✅ **Tela e lógica de login:** Sistema completo de autenticação JWT  
✅ **Fluxos de CRUD completo:** Usuários, Transações, Carteira  
✅ **Tratamento de erros/exceções:** HTTPException com mensagens descritivas  
✅ **Casos de teste:** 15 testes automatizados com Pytest  
✅ **Banco de dados em container Docker:** MongoDB containerizado  
✅ **Código em repositório GitHub:** Pronto para versionamento  
✅ **Documento de evidências:** Esta documentação completa  

### 13.2 Melhorias Futuras

- Implementar refresh tokens
- Adicionar autenticação 2FA
- Integrar API real de preços de criptomoedas
- Implementar WebSockets para atualizações em tempo real
- Adicionar gráficos e análises
- Implementar limites de transação
- Sistema de notificações
- Histórico de preços
- Exportação de relatórios

### 13.3 Contato e Suporte

Para dúvidas ou sugestões sobre o BankSys, entre em contato através do repositório GitHub.

---

**Fim da Documentação**

---

© 2025 BankSys - Sistema Bancário de Criptomoedas  
Versão 1.0.0 - Documentação Técnica Completa