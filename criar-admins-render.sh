#!/bin/bash

echo "🚀 Criando admins no Render..."
echo ""

RESPONSE=$(curl -s -X POST https://coleta-lixo-api.onrender.com/api/setup/setup-admins-temp-route-delete-after)

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

echo ""
echo "✅ Pronto! Agora você pode fazer login com:"
echo "   Email: wamber.pacheco.12@gmail.com"
echo "   Senha: adim18272313"
