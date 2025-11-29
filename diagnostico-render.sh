#!/bin/bash

echo "🔍 DIAGNÓSTICO - Backend no Render"
echo "=================================="
echo ""

echo "📍 Testando URLs do Backend:"
echo ""

# Teste 1: Raiz
echo "1️⃣ GET https://coleta-lixo-verde-backend.onrender.com/"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" https://coleta-lixo-verde-backend.onrender.com/)
STATUS=$(echo "$RESPONSE" | grep HTTP_STATUS | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v HTTP_STATUS)

if [ "$STATUS" = "200" ]; then
  echo "   ✅ Status: $STATUS"
  echo "   📄 Resposta: $BODY"
else
  echo "   ❌ Status: $STATUS"
  echo "   📄 Resposta: $BODY"
fi
echo ""

# Teste 2: Health
echo "2️⃣ GET https://coleta-lixo-verde-backend.onrender.com/health"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" https://coleta-lixo-verde-backend.onrender.com/health)
STATUS=$(echo "$RESPONSE" | grep HTTP_STATUS | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v HTTP_STATUS)

if [ "$STATUS" = "200" ]; then
  echo "   ✅ Status: $STATUS"
  echo "   📄 Resposta: $BODY"
else
  echo "   ❌ Status: $STATUS"
  echo "   📄 Resposta: $BODY"
fi
echo ""

# Teste 3: API Test
echo "3️⃣ GET https://coleta-lixo-verde-backend.onrender.com/api/test"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" https://coleta-lixo-verde-backend.onrender.com/api/test)
STATUS=$(echo "$RESPONSE" | grep HTTP_STATUS | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v HTTP_STATUS)

if [ "$STATUS" = "200" ]; then
  echo "   ✅ Status: $STATUS"
  echo "   📄 Resposta: $BODY"
else
  echo "   ❌ Status: $STATUS"
  echo "   📄 Resposta: $BODY"
fi
echo ""

echo "=================================="
echo ""
echo "💡 Interpretação dos Resultados:"
echo ""
if [ "$STATUS" = "404" ]; then
  echo "❌ PROBLEMA: Todas as rotas retornam 404"
  echo ""
  echo "Possíveis causas:"
  echo "1. Backend não está rodando no Render"
  echo "2. Nome do serviço está diferente no Dashboard"
  echo "3. Deploy falhou (veja os logs no Render)"
  echo "4. Serviço foi suspenso (free tier)"
  echo ""
  echo "🔧 PRÓXIMOS PASSOS:"
  echo "1. Entre em https://dashboard.render.com"
  echo "2. Procure pelo serviço 'coleta-lixo-verde-backend'"
  echo "3. Verifique o status (Live/Failed/Suspended)"
  echo "4. Se estiver Failed, veja os logs de deploy"
  echo "5. Se estiver Suspended, clique em 'Resume'"
  echo "6. Se não existir, crie um novo serviço web"
elif [ "$STATUS" = "503" ]; then
  echo "⏳ Backend está iniciando (aguarde 30-60 segundos)"
  echo "   O Render free tier demora para acordar"
elif [ "$STATUS" = "200" ]; then
  echo "✅ Backend está funcionando perfeitamente!"
else
  echo "⚠️ Status inesperado: $STATUS"
  echo "   Verifique os logs no Render Dashboard"
fi
echo ""
