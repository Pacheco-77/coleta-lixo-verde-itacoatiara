# Guia de Deploy no Render

## 📋 Pré-requisitos

1. Conta no Render (https://render.com)
2. Conta no MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
3. Repositório Git conectado

## 🗄️ Configuração do MongoDB Atlas

1. Acesse https://www.mongodb.com/cloud/atlas
2. Crie um cluster gratuito
3. Configure o acesso:
   - Vá em "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
   - Vá em "Database Access" → Crie um usuário com senha
4. Obtenha a string de conexão:
   - Clique em "Connect" → "Connect your application"
   - Copie a connection string (ex: `mongodb+srv://username:password@cluster.mongodb.net/coleta-lixo-verde`)

## 🚀 Deploy no Render

### Opção 1: Deploy Automático via render.yaml

1. Faça push do projeto para o GitHub
2. Acesse o Render Dashboard
3. Clique em "New" → "Blueprint"
4. Conecte seu repositório
5. O Render detectará o arquivo `render.yaml` automaticamente
6. Configure as variáveis de ambiente secretas:
   - `MONGODB_URI`: Sua connection string do MongoDB Atlas
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`: Configurações de email
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: (opcional) Para SMS
   - `WHATSAPP_BUSINESS_NUMBER`: (opcional) Para WhatsApp

### Opção 2: Deploy Manual

#### Backend

1. No Render Dashboard, clique em "New" → "Web Service"
2. Conecte seu repositório
3. Configure:
   - **Name**: `coleta-verde-backend`
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Adicione as variáveis de ambiente (veja seção abaixo)

#### Frontend

1. No Render Dashboard, clique em "New" → "Static Site"
2. Conecte seu repositório
3. Configure:
   - **Name**: `coleta-verde-frontend`
   - **Branch**: main
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Adicione a variável de ambiente:
   - `VITE_API_URL`: URL do backend (ex: `https://coleta-verde-backend.onrender.com`)

## 🔐 Variáveis de Ambiente Obrigatórias

### Backend

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/coleta-lixo-verde
JWT_SECRET=seu_jwt_secret_seguro
JWT_REFRESH_SECRET=seu_refresh_secret_seguro
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=https://seu-frontend.onrender.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
EMAIL_FROM=noreply@coletaverde.com.br
```

### Frontend

```env
VITE_API_URL=https://seu-backend.onrender.com
```

## ✅ Verificação Pós-Deploy

1. Acesse a URL do backend: `https://seu-backend.onrender.com/health`
   - Deve retornar status 200 com informações do sistema

2. Acesse a URL do frontend: `https://seu-frontend.onrender.com`
   - A aplicação deve carregar normalmente

3. Teste o login e funcionalidades básicas

## 🔧 Configurações Adicionais

### Domínio Customizado

1. No Render Dashboard, acesse seu serviço
2. Vá em "Settings" → "Custom Domain"
3. Adicione seu domínio
4. Configure os registros DNS conforme instruído

### Logs e Monitoramento

- Acesse os logs em tempo real no Render Dashboard
- Configure alertas em "Settings" → "Notifications"

### Backup do Banco de Dados

- Configure backups automáticos no MongoDB Atlas
- Vá em "Clusters" → "Backup" → "Configure Backup"

## 🐛 Troubleshooting

### Backend não conecta ao MongoDB
- Verifique se o IP 0.0.0.0/0 está permitido no MongoDB Atlas
- Confirme se a connection string está correta
- Verifique os logs no Render Dashboard

### Frontend não se conecta ao Backend
- Verifique se a variável `VITE_API_URL` está configurada corretamente
- Confirme se o backend está rodando (acesse /health)
- Verifique se o CORS está configurado para aceitar o domínio do frontend

### Serviço não inicia
- Verifique os logs de build e runtime no Render
- Confirme se todas as dependências estão no package.json
- Teste localmente com `NODE_ENV=production npm start`

## 📱 Contato e Suporte

Para dúvidas sobre o deploy, consulte:
- Documentação do Render: https://render.com/docs
- Documentação do MongoDB Atlas: https://docs.atlas.mongodb.com

