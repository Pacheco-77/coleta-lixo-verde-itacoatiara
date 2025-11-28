# ✅ Projeto Preparado para Deploy no Render

## 📦 O que foi feito

### 1. Arquivos de Configuração Criados

- ✅ `render.yaml` - Configuração automática de deploy
- ✅ `DEPLOY_RENDER.md` - Guia completo de deploy
- ✅ `RENDER_ENV_VARS.md` - Lista detalhada de variáveis de ambiente
- ✅ `CHECKLIST_DEPLOY.md` - Checklist passo a passo
- ✅ `check-deploy-config.sh` - Script de verificação automática

### 2. Verificações Realizadas

✅ Conexão do banco de dados está usando `process.env.MONGODB_URI`
✅ Backend configurado para aceitar CORS com `process.env.FRONTEND_URL`
✅ Todas as configurações sensíveis estão em variáveis de ambiente
✅ Estrutura de pastas está correta
✅ Package.json configurado com scripts corretos
✅ Git está configurado e conectado ao GitHub

## 🚀 Como Fazer o Deploy

### Passo 1: MongoDB Atlas (5 minutos)

1. Acesse https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um cluster (escolha região próxima)
4. Configure Network Access:
   - Vá em "Network Access" → "Add IP Address"
   - Selecione "Allow Access from Anywhere" (0.0.0.0/0)
5. Crie um usuário de banco de dados:
   - Vá em "Database Access" → "Add New Database User"
   - Escolha username e password (anote!)
   - Permissão: "Atlas Admin"
6. Obtenha a connection string:
   - Clique em "Connect" no seu cluster
   - "Connect your application"
   - Copie a string: `mongodb+srv://username:password@cluster.mongodb.net/coleta-lixo-verde`

### Passo 2: Commit e Push para GitHub

```bash
git add .
git commit -m "chore: preparar projeto para deploy no Render"
git push origin main
```

### Passo 3: Deploy no Render (10 minutos)

#### Backend:

1. Acesse https://dashboard.render.com
2. Clique em "New" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `coleta-verde-backend`
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Adicione as variáveis de ambiente (veja lista abaixo)
6. Clique em "Create Web Service"
7. Aguarde o deploy (5-10 min)
8. Copie a URL do backend: `https://coleta-verde-backend.onrender.com`

#### Frontend:

1. No Render Dashboard, clique em "New" → "Static Site"
2. Conecte o mesmo repositório
3. Configure:
   - **Name**: `coleta-verde-frontend`
   - **Branch**: main
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Adicione a variável de ambiente:
   - `VITE_API_URL`: URL do backend copiada acima

5. Clique em "Create Static Site"
6. Aguarde o build (5-10 min)

#### Atualizar FRONTEND_URL no Backend:

1. Copie a URL do frontend: `https://coleta-verde-frontend.onrender.com`
2. Volte ao serviço do backend no Render
3. Vá em "Environment" → Edite `FRONTEND_URL`
4. Cole a URL do frontend
5. Salve (o backend reiniciará automaticamente)

## 🔐 Variáveis de Ambiente Obrigatórias

### Backend (mínimo para funcionar):

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/coleta-lixo-verde
JWT_SECRET=<clique em Generate no Render>
JWT_REFRESH_SECRET=<clique em Generate no Render>
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=https://seu-frontend.onrender.com
```

### Frontend:

```env
VITE_API_URL=https://seu-backend.onrender.com
```

### Variáveis Opcionais (para email):

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=senha_de_app_do_gmail
EMAIL_FROM=noreply@coletaverde.com.br
```

**Para Gmail**: 
1. Ative verificação em 2 etapas
2. Vá em https://myaccount.google.com/apppasswords
3. Crie uma "Senha de App"
4. Use essa senha no `EMAIL_PASSWORD`

## ✅ Verificação Pós-Deploy

### 1. Teste o Backend:

```bash
curl https://seu-backend.onrender.com/health
```

Deve retornar:
```json
{
  "success": true,
  "message": "API está funcionando",
  "timestamp": "...",
  "uptime": 123,
  "environment": "production"
}
```

### 2. Teste o Frontend:

1. Acesse: `https://seu-frontend.onrender.com`
2. A página deve carregar
3. Abra o Console do navegador (F12)
4. Não deve haver erros de CORS ou conexão

### 3. Teste Funcionalidades:

1. ✅ Página inicial carrega
2. ✅ Registro de usuário funciona
3. ✅ Login funciona
4. ✅ Dashboard carrega após login
5. ✅ Mapa é exibido (se aplicável)

## 🐛 Problemas Comuns

### 1. Backend não inicia
**Erro**: `Error connecting to MongoDB`

**Solução**:
- Verifique se a connection string está correta
- Confirme que 0.0.0.0/0 está na whitelist do Atlas
- Teste a conexão no MongoDB Compass

### 2. Frontend não conecta ao Backend
**Erro**: `Network Error` ou `CORS error`

**Solução**:
- Verifique se `VITE_API_URL` está correto no frontend
- Verifique se `FRONTEND_URL` está correto no backend
- Aguarde alguns minutos (serviços gratuitos dormem)

### 3. Build falha
**Erro**: `npm install failed`

**Solução**:
- Verifique os logs no Render Dashboard
- Confirme que package.json está correto
- Delete node_modules local e teste: `npm install && npm run build`

## 📱 Primeiro Acesso

Após o deploy bem-sucedido:

1. Acesse o frontend: `https://seu-frontend.onrender.com`
2. Clique em "Registrar"
3. Crie uma conta de administrador
4. Faça login

## ⚠️ Notas Importantes

1. **Free Tier do Render**: Serviços dormem após 15min de inatividade
   - Primeiro acesso pode demorar ~1 minuto para "acordar"
   
2. **MongoDB Atlas Free**: Limite de 512MB de armazenamento
   - Suficiente para desenvolvimento e testes

3. **Segurança**: 
   - Nunca commite arquivos .env
   - Use secrets gerados pelo Render para JWT
   - Sempre use HTTPS em produção

4. **Domínio Customizado**: 
   - Pode adicionar domínio próprio nas configurações do Render
   - Gratuito com certificado SSL automático

## 📚 Documentação Adicional

- `DEPLOY_RENDER.md` - Instruções detalhadas de deploy
- `RENDER_ENV_VARS.md` - Lista completa de variáveis
- `CHECKLIST_DEPLOY.md` - Checklist interativo
- Execute `bash check-deploy-config.sh` para verificar configuração

## 🎉 Próximos Passos

Após deploy bem-sucedido:

1. Configure email (opcional)
2. Configure SMS/WhatsApp (opcional)
3. Adicione domínio customizado (opcional)
4. Configure monitoramento e alertas
5. Configure backup automático no MongoDB Atlas

## 📞 Suporte

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Issues do GitHub: crie um issue no repositório

---

✨ **Projeto pronto para deploy!** Siga os passos acima e sua aplicação estará no ar em ~20 minutos.
