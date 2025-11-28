# Checklist de Deploy no Render

## ✅ Antes do Deploy

### Configuração do MongoDB Atlas
- [ ] Criar conta no MongoDB Atlas
- [ ] Criar cluster gratuito
- [ ] Configurar Network Access (0.0.0.0/0)
- [ ] Criar usuário de banco de dados
- [ ] Obter connection string

### Configuração do Projeto
- [ ] Verificar se todas as dependências estão no package.json
- [ ] Testar build local: `cd frontend && npm run build`
- [ ] Testar backend local: `cd backend && npm start`
- [ ] Verificar se o arquivo render.yaml está configurado
- [ ] Commit e push para o GitHub

## 🚀 Durante o Deploy

### Backend
- [ ] Criar Web Service no Render
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente:
  - [ ] MONGODB_URI (connection string do Atlas)
  - [ ] JWT_SECRET (gerar novo seguro)
  - [ ] JWT_REFRESH_SECRET (gerar novo seguro)
  - [ ] FRONTEND_URL (URL do frontend após deploy)
  - [ ] EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD
  - [ ] NODE_ENV=production
- [ ] Iniciar deploy

### Frontend
- [ ] Criar Static Site no Render
- [ ] Conectar repositório GitHub
- [ ] Configurar variável:
  - [ ] VITE_API_URL (URL do backend após deploy)
- [ ] Iniciar deploy

## 🧪 Após o Deploy

### Testes Básicos
- [ ] Acessar /health do backend (deve retornar 200)
- [ ] Acessar frontend (deve carregar)
- [ ] Testar registro de usuário
- [ ] Testar login
- [ ] Testar funcionalidades principais

### Configurações Adicionais
- [ ] Atualizar FRONTEND_URL no backend com URL real
- [ ] Configurar domínio customizado (opcional)
- [ ] Configurar alertas e notificações
- [ ] Configurar backup do MongoDB Atlas

## 🔐 Variáveis de Ambiente

### Backend Obrigatórias
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/coleta-lixo-verde
JWT_SECRET=chave_secreta_segura
JWT_REFRESH_SECRET=chave_refresh_segura
FRONTEND_URL=https://seu-frontend.onrender.com
```

### Backend Opcionais
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=senha_de_app
EMAIL_FROM=noreply@coletaverde.com.br
TWILIO_ACCOUNT_SID=sid_aqui
TWILIO_AUTH_TOKEN=token_aqui
TWILIO_PHONE_NUMBER=+55number
```

### Frontend
```
VITE_API_URL=https://seu-backend.onrender.com
```

## 📝 Notas Importantes

1. **Segurança**: Nunca commite arquivos .env com dados sensíveis
2. **MongoDB Atlas**: Use sempre connection string com mongodb+srv://
3. **Free Tier**: Serviços gratuitos do Render dormem após inatividade
4. **CORS**: Certifique-se que o backend aceita requisições do frontend
5. **Build Time**: Primeiro deploy pode demorar 5-10 minutos

## 🐛 Problemas Comuns

### Backend não conecta ao MongoDB
→ Verificar IP whitelist no Atlas (0.0.0.0/0)
→ Verificar username e password na connection string

### Frontend não se comunica com Backend  
→ Verificar VITE_API_URL está correto
→ Verificar CORS no backend aceita domínio do frontend

### Build falha
→ Verificar logs no Render Dashboard
→ Testar build localmente
→ Verificar se todas as dependências estão instaladas

## 📞 Recursos

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Suporte Render: https://render.com/support

