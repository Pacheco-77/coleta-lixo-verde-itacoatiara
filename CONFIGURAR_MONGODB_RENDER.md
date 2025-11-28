# 🚨 Configuração Urgente: MONGODB_URI no Render

## Problema
O backend está falhando porque `MONGODB_URI` não está configurado no Render.

## Solução Rápida (5 minutos)

### 1. Obter Connection String do MongoDB Atlas

Se ainda não tem:

1. Acesse: https://cloud.mongodb.com
2. Faça login ou crie conta gratuita
3. Crie um cluster (M0 Free Tier)
4. Vá em **Network Access** → Add IP → **Allow Access from Anywhere** (0.0.0.0/0)
5. Vá em **Database Access** → Add User:
   - Username: `render_user`
   - Password: Gere uma senha forte (anote!)
   - Permissão: **Atlas Admin**
6. Clique no cluster → **Connect** → **Connect your application**
7. Copie a string (exemplo):
   ```
   mongodb+srv://render_user:SUA_SENHA@cluster0.xxxxx.mongodb.net/coleta-lixo-verde?retryWrites=true&w=majority
   ```

### 2. Configurar no Render

1. Acesse: https://dashboard.render.com
2. Selecione o serviço **coleta-verde-backend**
3. Vá em **Environment** (menu lateral)
4. Procure por `MONGODB_URI` ou clique em **Add Environment Variable**
5. Configure:
   - **Key**: `MONGODB_URI`
   - **Value**: Cole a connection string do MongoDB Atlas
   - Marque como **Secret** ✓
6. Clique em **Save Changes**

**O serviço reiniciará automaticamente** e deve funcionar!

### 3. Verificar

Após o deploy:
```bash
curl https://seu-backend.onrender.com/health
```

Deve retornar:
```json
{
  "success": true,
  "message": "API está funcionando",
  "environment": "production"
}
```

## ⚠️ Importante

- ✅ **Use `mongodb+srv://`** (não `mongodb://`)
- ✅ Substitua `SUA_SENHA` pela senha real do usuário
- ✅ Substitua `cluster0.xxxxx` pelo seu cluster real
- ✅ Marque como **Secret** no Render
- ✅ Permita IP 0.0.0.0/0 no MongoDB Atlas

## 🐛 Troubleshooting

### Erro: "Authentication failed"
→ Senha incorreta. Verifique a senha no MongoDB Atlas.

### Erro: "Could not connect to any servers"
→ IP não está na whitelist. Adicione 0.0.0.0/0 no Network Access.

### Erro: "MONGODB_URI não está configurado"
→ Variável não foi salva no Render. Verifique e salve novamente.

## 📝 Outras Variáveis Importantes

Enquanto estiver no Environment do Render, configure também:

### Obrigatórias (já devem estar configuradas pelo render.yaml):
- `NODE_ENV`: production
- `JWT_SECRET`: (gerado automaticamente)
- `JWT_REFRESH_SECRET`: (gerado automaticamente)
- `FRONTEND_URL`: https://seu-frontend.onrender.com

### Opcionais (configure depois se precisar de email):
- `EMAIL_HOST`: smtp.gmail.com
- `EMAIL_PORT`: 587
- `EMAIL_USER`: seu_email@gmail.com
- `EMAIL_PASSWORD`: senha_de_app_do_gmail
- `EMAIL_FROM`: noreply@coletaverde.com.br

## ✅ Checklist

- [ ] MongoDB Atlas criado
- [ ] IP 0.0.0.0/0 permitido no Atlas
- [ ] Usuário criado no Atlas
- [ ] Connection string copiada
- [ ] MONGODB_URI configurado no Render
- [ ] Serviço reiniciado
- [ ] /health retorna sucesso

---

**Tempo estimado**: 5-10 minutos

Após configurar, o deploy deve funcionar automaticamente! 🚀
