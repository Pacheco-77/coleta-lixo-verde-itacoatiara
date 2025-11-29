# FIX URGENTE: Adicionar VITE_API_URL no Render Dashboard

## Problema Atual

O frontend está dando 404 porque a variável VITE_API_URL não está configurada no Render Dashboard.

O arquivo render.yaml tem a variável, mas ela só funciona se você criar o serviço via Blueprint. Como você criou manualmente, precisa adicionar a variável no Dashboard.

---

## SOLUCAO (2 minutos)

### Passo 1 - Entre no Render Dashboard

https://dashboard.render.com/

### Passo 2 - Clique no serviço do Frontend

Nome: coleta-lixo-verde-itacoatiara

### Passo 3 - Vá em Environment

No menu lateral esquerdo, clique em Environment

### Passo 4 - Adicione a variável VITE_API_URL

Clique em Add Environment Variable e preencha:

Key: VITE_API_URL
Value: https://coleta-lixo-api.onrender.com/api

IMPORTANTE: Copie exatamente assim (com /api no final)

### Passo 5 - Clique em Save Changes

### Passo 6 - Force um Redeploy

Depois de salvar:
- Clique em Manual Deploy (botão no topo)
- Selecione Clear build cache & deploy
- Clique em Deploy

### Passo 7 - Aguarde o Deploy (2-3 minutos)

Aguarde até aparecer Live (verde). O build vai reinstalar tudo e compilar com a variável correta.

---

## Teste Depois do Deploy


https://coleta-lixo-verde-itacoatiara.onrender.com

### 2. Abra o Console do navegador (F12)

### 3. Va para a aba Network

### 4. Atualize a pagina (Ctrl+Shift+R)

### 5. Veja as requisicoes

- Deve chamar: https://coleta-lixo-api.onrender.com/api/public/news
- Nao deve mais dar 404
- Deve retornar dados JSON

---

## Se continuar dando 404 apos isso

### Verifique no Console do Browser

Abra o Console (F12) e digite:

console.log(import.meta.env.VITE_API_URL)

Deve aparecer:
https://coleta-lixo-api.onrender.com/api

Se aparecer undefined:
- A variavel nao foi carregada no build
- Refaca o deploy com Clear build cache

### Verifique a requisicao

- Abra a aba Network (F12)
- Veja qual URL esta sendo chamada
- Se for localhost ou URL errada = cache do navegador
- Solucao: Ctrl+Shift+R (hard reload)

---

## Checklist

Marque cada item:

- [ ] Entrei no Render Dashboard
- [ ] Cliquei no servico coleta-lixo-verde-itacoatiara
- [ ] Fui em Environment
- [ ] Adicionei VITE_API_URL=https://coleta-lixo-api.onrender.com/api
- [ ] Salvei as mudancas
- [ ] Fiz Manual Deploy e Clear build cache & deploy
- [ ] Aguardei aparecer Live (verde)
- [ ] Abri o frontend no navegador
- [ ] Abri o Console (F12) e Network
- [ ] Vi que esta chamando coleta-lixo-api.onrender.com/api
- [ ] Nao esta mais dando 404

---

## Por que isso aconteceu

Vite so carrega variaveis que comecam com VITE_ durante o BUILD.

Se voce nao define VITE_API_URL no momento do build, o Vite compila com undefined e o codigo usa o fallback http://localhost:5000/api.

Por isso voce precisa:
1. Adicionar a variavel no Environment
2. Fazer um novo build (redeploy)
3. Ai o Vite vai compilar o codigo com a URL correta hardcoded no JavaScript

Apos isso, o frontend vai funcionar perfeitamente!

**Após isso, o frontend vai funcionar perfeitamente!** 🚀
