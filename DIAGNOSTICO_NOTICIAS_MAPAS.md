# 🔍 Guia de Diagnóstico - Notícias e Mapas não aparecem

## Status Atual
- ✅ Deploy enviado para Render
- ✅ Logs de debug adicionados
- ⏳ Aguardando deploy (2-5 minutos)

## Como Verificar os Logs no Navegador

### 1. Abrir Console do Navegador
1. Acesse: https://coleta-lixo-verde-itacoatiara.onrender.com
2. Pressione **F12** ou **Ctrl+Shift+I** (Windows/Linux) ou **Cmd+Option+I** (Mac)
3. Clique na aba **Console**

### 2. O que Verificar

#### Logs Esperados (Se tudo estiver funcionando):
```
Buscando notícias... {limit: 5}
Notícias recebidas: {success: true, count: 5, data: Array(5)}
5 pontos carregados com sucesso
Buscando estatísticas públicas...
Estatísticas recebidas: {success: true, data: {...}}
```

#### Erros Comuns e Significados:

##### Erro 404 (Rota não encontrada):
```
Erro ao buscar notícias: Request failed with status code 404
```
**Causa:** API não encontrada ou rota incorreta
**Solução:** Verificar se backend está rodando

##### Erro de CORS:
```
Access to XMLHttpRequest blocked by CORS policy
```
**Causa:** Backend não permite requisições do frontend
**Solução:** Verificar configuração CORS no backend

##### Erro de Timeout:
```
Erro ao buscar notícias: timeout of 10000ms exceeded
```
**Causa:** Backend demorou mais de 10s para responder
**Solução:** Backend pode estar "dormindo" (Render free tier)

##### Erro de Rede:
```
Network Error
```
**Causa:** Backend não está acessível
**Solução:** Verificar se backend está online

### 3. Testar API Diretamente

Abra em uma nova aba do navegador:

#### Teste 1: Health Check
```
https://coleta-lixo-api.onrender.com/health
```
**Esperado:** `{"status":"healthy",...}`

#### Teste 2: Notícias
```
https://coleta-lixo-api.onrender.com/api/public/news
```
**Esperado:** `{"success":true,"count":5,"data":[...]}`

#### Teste 3: Pontos de Coleta
```
https://coleta-lixo-api.onrender.com/api/pontos
```
**Esperado:** `{"success":true,"data":[...]}`

#### Teste 4: Estatísticas
```
https://coleta-lixo-api.onrender.com/api/public/statistics
```
**Esperado:** `{"success":true,"data":{...}}`

### 4. Usar Arquivo de Teste HTML

Abra o arquivo `test-api.html` no seu navegador:
- Clique nos botões para testar cada endpoint
- Verifique se retorna sucesso ✅ ou erro ❌
- Veja os dados retornados em cada teste

## Possíveis Problemas e Soluções

### Problema 1: Backend "dormindo" no Render Free Tier
**Sintoma:** Primeiro request demora 30-50 segundos
**Solução:** Aguardar o backend "acordar" na primeira visita

### Problema 2: Notícias não foram criadas no banco
**Sintoma:** API retorna `{"count":0,"data":[]}`
**Solução:** Verificar logs do backend no Render Dashboard

### Problema 3: MongoDB não está conectado
**Sintoma:** Erro 500 Internal Server Error
**Solução:** Verificar MONGODB_URI nas variáveis de ambiente

### Problema 4: Variável VITE_API_URL incorreta
**Sintoma:** Requests vão para URL errada
**Solução:** Verificar se aponta para https://coleta-lixo-api.onrender.com/api

## Próximos Passos

1. ✅ **Aguardar Deploy** (2-5 minutos após git push)
2. 🔍 **Abrir Console** (F12) no site
3. 📝 **Copiar Mensagens** de erro que aparecerem
4. 🔗 **Testar URLs** diretas da API no navegador
5. 📊 **Reportar Resultado** com os logs/erros encontrados

## Comandos Úteis para Verificar Render

### Ver Logs do Backend:
1. Acesse: https://dashboard.render.com
2. Entre no serviço `coleta-lixo-verde-backend`
3. Clique em **Logs**
4. Procure por:
   - `MongoDB Connected`
   - `✅ X notícias adicionadas`
   - `Server running on port 10000`

### Ver Logs do Frontend:
1. Acesse: https://dashboard.render.com
2. Entre no serviço `coleta-lixo-verde-frontend`
3. Verifique se o build foi bem-sucedido
4. Procure por: `✓ built in Xs`

---

## Dica Rápida

Se você ver no console:
```
Buscando notícias...
```
Mas não aparecer `Notícias recebidas:`, então o problema está na chamada da API.

Se você ver:
```
Notícias recebidas: {success: true, count: 0, data: []}
```
Então a API funciona, mas não há notícias no banco de dados.

Se não aparecer nenhum log, então o componente HomePage não está sendo renderizado ou há erro de JavaScript bloqueando a execução.
