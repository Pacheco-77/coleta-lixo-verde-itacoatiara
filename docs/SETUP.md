# 🚀 Guia de Instalação e Configuração

Este guia fornece instruções detalhadas para configurar e executar o Sistema de Coleta de Lixo Verde localmente.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v16 ou superior) - [Download](https://nodejs.org/)
- **MongoDB** (v5 ou superior) - [Download](https://www.mongodb.com/try/download/community)
  - Ou conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuito)
- **Git** - [Download](https://git-scm.com/)
- **NPM** ou **Yarn** (vem com Node.js)

### Verificar instalações

```bash
node --version
npm --version
mongo --version  # ou mongod --version
git --version
```

## 📦 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/coleta-lixo-verde.git
cd coleta-lixo-verde
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

#### Criar arquivo .env

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/coleta-lixo-verde
# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coleta-lixo-verde

# JWT Configuration
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=seu_refresh_token_secret_aqui
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
EMAIL_FROM=noreply@coletaverde.com.br

# Twilio (SMS) - Opcional
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_PHONE_NUMBER=+5592999999999

# Admin Default
ADMIN_EMAIL=admin@coletaverde.com.br
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Administrador Sistema
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

#### Criar arquivo .env

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=sua_chave_aqui (opcional)
```

### 4. Configurar MongoDB

#### Opção A: MongoDB Local

1. Inicie o MongoDB:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# ou
mongod --dbpath /caminho/para/dados
```

2. Verifique se está rodando:

```bash
mongo
# ou
mongosh
```

#### Opção B: MongoDB Atlas (Nuvem)

1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure o acesso de rede (IP Whitelist)
4. Obtenha a string de conexão
5. Atualize `MONGODB_URI` no `.env`

### 5. Configurar Email (Gmail)

Para enviar emails, você precisa de uma senha de aplicativo do Gmail:

1. Acesse [Conta Google](https://myaccount.google.com/)
2. Vá em **Segurança** > **Verificação em duas etapas** (ative se necessário)
3. Vá em **Senhas de app**
4. Gere uma senha para "Outro (nome personalizado)"
5. Use essa senha no `EMAIL_PASSWORD` do `.env`

### 6. Gerar Secrets JWT

Para gerar secrets seguros:

```bash
# No terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Use o resultado para `JWT_SECRET` e `JWT_REFRESH_SECRET`.

## 🚀 Executar o Projeto

### Desenvolvimento

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

O backend estará rodando em: `http://localhost:5000`

#### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

O frontend estará rodando em: `http://localhost:3000`

### Produção

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run build
# Servir os arquivos estáticos com um servidor web
```

## 🗄️ Seed do Banco de Dados

Para popular o banco com dados iniciais (usuário admin, etc.):

```bash
cd backend
npm run seed
```

Isso criará:
- Usuário administrador padrão
- Alguns pontos de coleta de exemplo
- Rotas de exemplo
- Dados de teste

### Credenciais Padrão

**Administrador:**
- Email: `admin@coletaverde.com.br`
- Senha: `Admin@123456`

**Coletor de Teste:**
- Email: `coletor@coletaverde.com.br`
- Senha: `Coletor@123`

**Cidadão de Teste:**
- Email: `cidadao@coletaverde.com.br`
- Senha: `Cidadao@123`

⚠️ **IMPORTANTE:** Altere essas senhas em produção!

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## 🔧 Solução de Problemas

### MongoDB não conecta

**Erro:** `MongoNetworkError: failed to connect to server`

**Solução:**
1. Verifique se o MongoDB está rodando
2. Verifique a string de conexão no `.env`
3. Para Atlas, verifique o IP whitelist

### Porta já em uso

**Erro:** `EADDRINUSE: address already in use :::5000`

**Solução:**
```bash
# Encontrar processo usando a porta
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Matar o processo
kill -9 PID  # macOS/Linux
taskkill /PID PID /F  # Windows
```

### Erro de CORS

**Erro:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solução:**
1. Verifique se `FRONTEND_URL` no backend `.env` está correto
2. Verifique se `REACT_APP_API_URL` no frontend `.env` está correto

### Erro ao enviar email

**Erro:** `Invalid login: 535-5.7.8 Username and Password not accepted`

**Solução:**
1. Use uma senha de aplicativo do Gmail (não sua senha normal)
2. Ative a verificação em duas etapas
3. Verifique se `EMAIL_USER` e `EMAIL_PASSWORD` estão corretos

### Módulos não encontrados

**Erro:** `Cannot find module 'express'`

**Solução:**
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## 📱 Configuração Mobile

Para testar em dispositivos móveis na mesma rede:

1. Encontre seu IP local:

```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

2. Atualize os arquivos `.env`:

```env
# Backend
API_URL=http://SEU_IP:5000

# Frontend
REACT_APP_API_URL=http://SEU_IP:5000/api
REACT_APP_SOCKET_URL=http://SEU_IP:5000
```

3. Acesse no dispositivo móvel: `http://SEU_IP:3000`

## 🔐 Configuração de Segurança

### Em Produção

1. **Altere todos os secrets e senhas**
2. **Use HTTPS**
3. **Configure firewall**
4. **Ative rate limiting**
5. **Configure backup do banco de dados**
6. **Use variáveis de ambiente seguras**
7. **Monitore logs de erro**

### Variáveis Sensíveis

Nunca commite arquivos `.env` no Git. Eles já estão no `.gitignore`.

## 📚 Próximos Passos

Após a instalação:

1. ✅ Acesse o sistema em `http://localhost:3000`
2. ✅ Faça login com as credenciais padrão
3. ✅ Explore as funcionalidades
4. ✅ Leia a [Documentação da API](./API.md)
5. ✅ Leia o [Guia de Deploy](./DEPLOYMENT.md)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do console
2. Verifique os logs do servidor (`backend/logs/`)
3. Consulte a documentação
4. Abra uma issue no GitHub

## 📞 Contato

- Email: suporte@coletaverde.com.br
- GitHub: [Issues](https://github.com/seu-usuario/coleta-lixo-verde/issues)

---

**Desenvolvido para Itacoatiara-AM** 🌿
