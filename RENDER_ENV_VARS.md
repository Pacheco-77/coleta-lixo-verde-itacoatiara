# 🌍 Variáveis de Ambiente para Render

Este arquivo lista todas as variáveis de ambiente que devem ser configuradas no Render.com para o deploy da aplicação.

## 📦 Backend (Web Service)

### Obrigatórias

| Variável | Descrição | Exemplo | Notas |
|----------|-----------|---------|-------|
| `NODE_ENV` | Ambiente de execução | `production` | Fixo |
| `PORT` | Porta do servidor | `5000` | Usar 5000 ou deixar automático |
| `MONGODB_URI` | Connection string do MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | Obter do MongoDB Atlas |
| `JWT_SECRET` | Segredo para JWT | *gerar aleatório* | Use o gerador do Render |
| `JWT_REFRESH_SECRET` | Segredo para refresh token | *gerar aleatório* | Use o gerador do Render |
| `JWT_EXPIRE` | Expiração do JWT | `7d` | 7 dias |
| `JWT_REFRESH_EXPIRE` | Expiração do refresh token | `30d` | 30 dias |
| `FRONTEND_URL` | URL do frontend | `https://seu-frontend.onrender.com` | Configurar após deploy do frontend |

### Opcionais (Email)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EMAIL_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `EMAIL_PORT` | Porta SMTP | `587` |
| `EMAIL_USER` | Email para envio | `seu_email@gmail.com` |
| `EMAIL_PASSWORD` | Senha do email | `sua_senha_de_app` |
| `EMAIL_FROM` | Email remetente | `noreply@coletaverde.com.br` |

**Nota Gmail**: Para usar Gmail, ative a verificação em 2 etapas e crie uma "Senha de App" em https://myaccount.google.com/apppasswords

### Opcionais (SMS/WhatsApp via Twilio)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `TWILIO_ACCOUNT_SID` | SID da conta Twilio | `ACxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Token de autenticação | `xxxxxxxxxxxxx` |
| `TWILIO_PHONE_NUMBER` | Número Twilio | `+5592999999999` |
| `WHATSAPP_BUSINESS_NUMBER` | Número WhatsApp Business | `5592999999999` |

### Configurações Adicionais

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `TWO_FACTOR_APP_NAME` | Nome do app para 2FA | `Coleta Verde Itacoatiara` |
| `DEFAULT_CITY_LAT` | Latitude padrão | `-3.1428` |
| `DEFAULT_CITY_LNG` | Longitude padrão | `-58.4438` |
| `DEFAULT_MAP_ZOOM` | Zoom padrão do mapa | `13` |
| `MAX_FILE_SIZE` | Tamanho máx arquivo (bytes) | `5242880` (5MB) |
| `RATE_LIMIT_WINDOW_MS` | Janela de rate limit | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máx requisições | `100` |

## 🎨 Frontend (Static Site)

| Variável | Descrição | Exemplo | Notas |
|----------|-----------|---------|-------|
| `VITE_API_URL` | URL da API backend | `https://seu-backend.onrender.com` | Configurar após deploy do backend |

## 🔐 Como Configurar no Render

### Para o Backend:

1. Acesse o dashboard do Render
2. Selecione o serviço backend
3. Vá em **Settings** → **Environment**
4. Clique em **Add Environment Variable**
5. Para variáveis secretas, marque **Secret** (ficará oculta)
6. Para JWT secrets, use o botão **Generate** do Render

### Para o Frontend:

1. Acesse o dashboard do Render
2. Selecione o static site frontend
3. Vá em **Settings** → **Environment**
4. Adicione apenas: `VITE_API_URL`

## 📝 Ordem de Deploy

1. **Backend primeiro**: Deploy do backend e aguarde a URL
2. **Atualize FRONTEND_URL**: No backend, configure a URL do frontend (pode deixar temporário)
3. **Frontend depois**: Deploy do frontend usando a URL do backend
4. **Atualize FRONTEND_URL**: Volte ao backend e atualize com a URL real do frontend

## 🔒 Gerando Secrets Seguros

Para gerar secrets fortes, use:

```bash
# No terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Ou use o gerador automático do Render clicando em "Generate" ao lado da variável.

## ✅ Verificação

Após configurar todas as variáveis:

1. **Backend**: Acesse `https://seu-backend.onrender.com/health`
   - Deve retornar status 200 com informações do sistema

2. **Frontend**: Acesse `https://seu-frontend.onrender.com`
   - Aplicação deve carregar
   - Console não deve ter erros de conexão

3. **Conexão**: Teste login/registro
   - Deve comunicar com o backend sem erros

## 🐛 Troubleshooting

### Backend não conecta ao MongoDB
```
Error: MONGODB_URI incorreto ou MongoDB não acessível
```
**Solução**: 
- Verifique a connection string no MongoDB Atlas
- Confirme que o IP 0.0.0.0/0 está na whitelist
- Teste a conexão com: `mongodb+srv://user:pass@cluster.mongodb.net/test`

### CORS Error no Frontend
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solução**:
- Verifique FRONTEND_URL no backend
- Confirme que corresponde à URL real do frontend
- Reinicie o backend após alterar

### JWT Error
```
JsonWebTokenError: invalid signature
```
**Solução**:
- Gere novos secrets
- Não use valores de exemplo/desenvolvimento
- Limpe localStorage do navegador e faça novo login

## 📞 Suporte

- Render Status: https://status.render.com
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
