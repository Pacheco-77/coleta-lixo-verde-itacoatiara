# 🚀 GUIA: Criar Backend no Render

## ❌ Problema Identificado:
Você tem apenas 1 serviço no Render (frontend), mas precisa de 2:
- ✅ Frontend: `coleta-lixo-verde-itacoatiara` (já existe)
- ❌ Backend: **NÃO EXISTE** (precisa criar)

---

## 📋 Criar Serviço de Backend

### 1️⃣ Entre no Render Dashboard
```
https://dashboard.render.com/
```

### 2️⃣ Criar Novo Serviço
- Clique em **"New +"** (canto superior direito)
- Selecione **"Web Service"**

### 3️⃣ Conectar Repositório
- Repositório: `Pacheco-77/coleta-lixo-verde-itacoatiara`
- Branch: `main`
- Clique em **"Connect"**

### 4️⃣ Configurar Serviço

**Informações Básicas:**
```
Name: coleta-lixo-verde-backend
Region: Oregon (US West)
Branch: main
Root Directory: (deixe VAZIO - não preencha nada)
```

**Build & Deploy:**
```
Runtime: Node
Build Command: cd backend && npm ci
Start Command: cd backend && npm start
```

**Instance Type:**
```
Free
```

### 5️⃣ Variáveis de Ambiente (IMPORTANTE!)

Clique em **"Advanced"** e adicione cada variável:

```bash
# Ambiente
NODE_ENV=production

# MongoDB (OBRIGATÓRIO - pegue do MongoDB Atlas)
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/coleta-verde?retryWrites=true&w=majority

# JWT Secrets (OBRIGATÓRIO - gere strings aleatórias)
JWT_SECRET=cole_aqui_string_aleatoria_minimo_32_caracteres
JWT_REFRESH_SECRET=cole_aqui_outra_string_diferente_minimo_32_caracteres
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Frontend (URL do seu frontend no Render)
FRONTEND_URL=https://coleta-lixo-verde-itacoatiara.onrender.com

# Email (opcional - deixe em branco por enquanto)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=

# Twilio/WhatsApp (opcional - deixe em branco)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
WHATSAPP_BUSINESS_NUMBER=

# Configurações de mapa
DEFAULT_CITY_LAT=-3.1428
DEFAULT_CITY_LNG=-58.4438
DEFAULT_MAP_ZOOM=13

# Limites
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ ATENÇÃO:**
- **MONGODB_URI** é OBRIGATÓRIO! Pegue a connection string no MongoDB Atlas
- **JWT_SECRET** e **JWT_REFRESH_SECRET** devem ser strings aleatórias diferentes

### 6️⃣ Criar Serviço
- Clique em **"Create Web Service"**
- Aguarde o deploy (2-5 minutos)

### 7️⃣ Verificar Deploy
Quando aparecer **"Live"** (verde):
- Copie a **URL pública** (algo como `https://coleta-lixo-verde-backend-xyz.onrender.com`)
- Teste no navegador: `<URL_DO_BACKEND>/health`
- Deve retornar JSON com `"success": true`

---

## 🔑 Como Gerar JWT Secrets

Execute no terminal para gerar strings aleatórias:

```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# JWT_REFRESH_SECRET (execute novamente para gerar outro)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie os valores gerados e cole nas variáveis de ambiente no Render.

---

## 🗄️ Como Pegar MONGODB_URI

1. Entre no MongoDB Atlas: https://cloud.mongodb.com/
2. Clique em **"Connect"** no seu cluster
3. Escolha **"Connect your application"**
4. Copie a connection string (algo como):
   ```
   mongodb+srv://usuario:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Substitua `<password>` pela sua senha real
6. Adicione o nome do database: `/coleta-verde`
7. String final:
   ```
   mongodb+srv://usuario:SUA_SENHA@cluster.mongodb.net/coleta-verde?retryWrites=true&w=majority
   ```

---

## ✅ Após Backend Criado

**Me envie a URL pública do backend** (aparece no topo do dashboard do serviço).

Exemplo: `https://coleta-lixo-verde-backend-xyz.onrender.com`

Com essa URL, vou atualizar o frontend para se conectar ao backend corretamente!

---

## 🆘 Se der erro no deploy

**Erro comum: "MONGODB_URI não está configurado"**
- Solução: Adicione a variável MONGODB_URI nas Environment Variables

**Erro: "Cannot find module..."**
- Solução: Verifique se o Build Command está correto: `cd backend && npm ci`

**Erro: "Port already in use"**
- Solução: Impossível no Render (cada serviço tem porta própria)

**Deploy fica travado em "Building..."**
- Solução: Aguarde 5-10 minutos. Render free tier pode demorar.
