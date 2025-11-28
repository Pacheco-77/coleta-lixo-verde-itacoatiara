#!/bin/bash

# Script de verificação de configuração para deploy no Render
# Execute: bash check-deploy-config.sh

echo "🔍 Verificando configuração do projeto para deploy no Render..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
WARNINGS=0
ERRORS=0
SUCCESS=0

# Função para verificar arquivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

# Função para verificar variável no .env
check_env_var() {
    if grep -q "^$1=" "$2" 2>/dev/null; then
        VALUE=$(grep "^$1=" "$2" | cut -d '=' -f 2-)
        if [ "$VALUE" == "$3" ] || [ "$VALUE" == "" ]; then
            echo -e "${YELLOW}⚠${NC} $1 precisa ser configurado em $2"
            ((WARNINGS++))
        else
            echo -e "${GREEN}✓${NC} $1 configurado"
            ((SUCCESS++))
        fi
    else
        echo -e "${RED}✗${NC} $1 não encontrado em $2"
        ((ERRORS++))
    fi
}

echo "📁 Verificando estrutura de arquivos..."
check_file "backend/package.json" "Backend package.json existe"
check_file "frontend/package.json" "Frontend package.json existe"
check_file "backend/src/server.js" "Backend server.js existe"
check_file "backend/src/config/database.js" "Configuração de database existe"
check_file "render.yaml" "Arquivo render.yaml existe"
check_file "backend/.env.example" "Backend .env.example existe"
check_file "frontend/.env.example" "Frontend .env.example existe"

echo ""
echo "🔧 Verificando configuração do Backend..."
if [ -f "backend/.env" ]; then
    check_env_var "MONGODB_URI" "backend/.env" "mongodb://localhost:27017/coleta-lixo-verde"
    check_env_var "JWT_SECRET" "backend/.env" "seu_jwt_secret_super_seguro_aqui_mude_em_producao"
    check_env_var "JWT_REFRESH_SECRET" "backend/.env" "seu_refresh_token_secret_aqui"
    check_env_var "FRONTEND_URL" "backend/.env" "http://localhost:3000"
else
    echo -e "${YELLOW}⚠${NC} backend/.env não existe (será necessário configurar no Render)"
    ((WARNINGS++))
fi

echo ""
echo "🎨 Verificando configuração do Frontend..."
if [ -f "frontend/.env" ]; then
    check_env_var "VITE_API_URL" "frontend/.env" "http://localhost:5000"
else
    echo -e "${YELLOW}⚠${NC} frontend/.env não existe (será necessário configurar no Render)"
    ((WARNINGS++))
fi

echo ""
echo "📦 Verificando dependências do Backend..."
cd backend 2>/dev/null
if [ -f "package.json" ]; then
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✓${NC} Node.js instalado: $(node -v)"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} Node.js não instalado"
        ((ERRORS++))
    fi
    
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} Dependências do backend instaladas"
        ((SUCCESS++))
    else
        echo -e "${YELLOW}⚠${NC} Dependências do backend não instaladas (execute: npm install)"
        ((WARNINGS++))
    fi
fi
cd ..

echo ""
echo "🎨 Verificando dependências do Frontend..."
cd frontend 2>/dev/null
if [ -f "package.json" ]; then
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} Dependências do frontend instaladas"
        ((SUCCESS++))
    else
        echo -e "${YELLOW}⚠${NC} Dependências do frontend não instaladas (execute: npm install)"
        ((WARNINGS++))
    fi
fi
cd ..

echo ""
echo "🗄️ Verificando MongoDB..."
if grep -q "mongodb://localhost" backend/.env 2>/dev/null; then
    echo -e "${YELLOW}⚠${NC} MongoDB configurado para localhost (use MongoDB Atlas para produção)"
    ((WARNINGS++))
elif grep -q "mongodb+srv://" backend/.env 2>/dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB Atlas configurado"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} MongoDB não configurado"
    ((ERRORS++))
fi

echo ""
echo "🔐 Verificando segredos..."
if [ -f "backend/.env" ]; then
    if grep -q "coleta_verde_jwt_secret" backend/.env || grep -q "seu_jwt_secret" backend/.env; then
        echo -e "${YELLOW}⚠${NC} JWT_SECRET usando valor padrão (gere um novo para produção)"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓${NC} JWT_SECRET customizado"
        ((SUCCESS++))
    fi
fi

echo ""
echo "📝 Verificando Git..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Repositório Git inicializado"
    ((SUCCESS++))
    
    if git remote -v | grep -q "github.com"; then
        echo -e "${GREEN}✓${NC} Remote GitHub configurado"
        ((SUCCESS++))
    else
        echo -e "${YELLOW}⚠${NC} Remote GitHub não configurado"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} Repositório Git não inicializado"
    ((ERRORS++))
fi

# Resumo
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO DA VERIFICAÇÃO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Sucessos:${NC} $SUCCESS"
echo -e "${YELLOW}⚠ Avisos:${NC} $WARNINGS"
echo -e "${RED}✗ Erros:${NC} $ERRORS"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Projeto pronto para deploy!${NC}"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Criar conta no MongoDB Atlas e obter connection string"
    echo "2. Fazer push do código para GitHub"
    echo "3. Criar serviço no Render usando render.yaml"
    echo "4. Configurar variáveis de ambiente no Render"
    echo ""
    echo "📖 Leia DEPLOY_RENDER.md para instruções detalhadas"
else
    echo -e "${RED}✗ Corrija os erros antes de fazer deploy${NC}"
    exit 1
fi

if [ $WARNINGS -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠ Atenção aos avisos acima antes de fazer deploy${NC}"
fi
