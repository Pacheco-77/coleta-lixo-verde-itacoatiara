#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO DO RENDER"
echo "=================================="
echo ""

# 1. Recriar admins
echo "1️⃣ Recriando admins..."
SETUP_RESULT=$(curl -s -X POST https://coleta-lixo-api.onrender.com/api/setup/setup-admins-temp-route-delete-after)
echo "$SETUP_RESULT" | python3 -m json.tool 2>/dev/null || echo "$SETUP_RESULT"
echo ""

# Aguardar 2 segundos
sleep 2

# 2. Tentar login
echo "2️⃣ Tentando login..."
LOGIN_RESULT=$(curl -s -X POST https://coleta-lixo-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wamber.pacheco.12@gmail.com","password":"adim18272313"}')
echo "$LOGIN_RESULT" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESULT"
echo ""

# 3. Verificar banco de dados via health
echo "3️⃣ Verificando conexão com banco..."
HEALTH=$(curl -s https://coleta-lixo-api.onrender.com/health)
echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
echo ""

echo "=================================="
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Veja os logs do Render em tempo real:"
echo "   Dashboard > coleta-lixo-api > Logs"
echo ""
echo "2. Procure por mensagens '🔍 DEBUG' nos logs"
echo ""
echo "3. Verifique se MONGODB_URI está configurado:"
echo "   Dashboard > coleta-lixo-api > Environment"
echo ""
echo "4. Se os logs mostrarem 'isPasswordValid: false':"
echo "   - O banco pode ser diferente"
echo "   - A senha pode ter espaços extras"
echo "   - O modelo User pode ter problema"
