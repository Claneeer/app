# 🏦 BankSys - Sistema Bancário de Criptomoedas

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-19.0.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-7.0+-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Sistema bancário completo para gerenciamento de carteiras de criptomoedas com interface web responsiva, autenticação JWT e operações CRUD completas.

## 📋 Funcionalidades

- ✅ **Autenticação Segura:** Sistema de login/registro com JWT
- ✅ **CRUD Completo:** Gerenciamento total de usuários e transações
- ✅ **Carteira Digital:** Visualização de saldo e ativos em tempo real
- ✅ **Transações:** Compra e venda de criptomoedas
- ✅ **Histórico:** Registro completo de todas as operações
- ✅ **Responsivo:** Interface adaptável para mobile, tablet e desktop
- ✅ **Testes Automatizados:** 15 casos de teste com Pytest
- ✅ **Containerizado:** Pronto para deploy com Docker

## 🚀 Tecnologias

### Backend
- Python 3.10+
- FastAPI (Framework web)
- MongoDB (Banco de dados NoSQL)
- Motor (Driver assíncrono MongoDB)
- JWT (Autenticação)
- Bcrypt (Hash de senhas)
- Pytest (Testes)

### Frontend
- React 19
- React Router (Roteamento)
- Tailwind CSS (Estilização)
- Axios (Cliente HTTP)
- Shadcn/UI (Componentes)
- Lucide React (Ícones)

## 📦 Instalação

### Pré-requisitos
- Docker 20.10+
- Docker Compose 1.29+
- Git

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/banksys.git
cd banksys
```

2. **Configure as variáveis de ambiente:**
```bash
# Backend
cd backend
cp .env.example .env
# Edite .env e configure JWT_SECRET_KEY

# Frontend
cd ../frontend
cp .env.example .env
# Configure REACT_APP_BACKEND_URL se necessário
```

3. **Inicie os containers Docker:**
```bash
cd ..
docker-compose up -d
```

4. **Acesse a aplicação:**
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8001/docs

## 🧪 Executando Testes

```bash
cd backend
pytest -v
```

Resultado esperado:
```
15 passed in 2.35s
```

## 📚 Documentação

Documentação técnica completa disponível em: [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md)

## 🎨 Design

O BankSys segue o modelo de cores 70/20/10:
- **70% Primária:** #F5F5F5 (Cinza Claro)
- **20% Secundária:** #1E3A8A (Azul Escuro)
- **10% Destaque:** #10B981 (Verde)

## 🔐 Segurança

- Senhas protegidas com Bcrypt
- Autenticação JWT com expiração
- Validação de dados com Pydantic
- CORS configurado
- Proteção contra injeção de código

## 📊 Estrutura do Projeto

```
banksys/
├── backend/
│   ├── server.py              # API FastAPI
│   ├── requirements.txt       # Dependências Python
│   ├── tests/                 # Testes automatizados
│   └── .env                   # Variáveis de ambiente
├── frontend/
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   └── api/              # Cliente API
│   ├── package.json          # Dependências Node.js
│   └── .env                  # Variáveis de ambiente
├── docs/
│   └── DOCUMENTATION.md      # Documentação técnica
├── docker-compose.yml        # Orquestração Docker
└── README.md                 # Este arquivo
```

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário autenticado
- `PUT /api/auth/update` - Atualizar perfil
- `DELETE /api/auth/delete` - Deletar conta

### Criptomoedas
- `GET /api/cryptos` - Listar criptomoedas disponíveis

### Carteira
- `GET /api/wallet` - Obter carteira do usuário
- `GET /api/wallet/balance` - Obter saldo total

### Transações
- `POST /api/transactions/buy` - Comprar criptomoeda
- `POST /api/transactions/sell` - Vender criptomoeda
- `GET /api/transactions/history` - Histórico de transações

## 🔄 Fluxo de Uso

1. Usuário se registra ou faz login
2. Visualiza dashboard com saldo
3. Compra criptomoedas disponíveis
4. Visualiza ativos na carteira
5. Vende ativos quando desejar
6. Consulta histórico de transações
7. Gerencia perfil e configurações

## 🐛 Solução de Problemas

**Containers não iniciam:**
```bash
docker-compose down
docker-compose up --build
```

**Erro de conexão com MongoDB:**
```bash
docker-compose restart mongodb
```

**Frontend não carrega:**
```bash
cd frontend
yarn install
yarn start
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como projeto de demonstração para sistema bancário de criptomoedas.

## 🙏 Agradecimentos

- FastAPI pela excelente framework
- React pela biblioteca UI
- Shadcn/UI pelos componentes
- MongoDB pelo banco de dados

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**