const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Rota temporária para criar admins (REMOVER APÓS USAR!)
router.post('/setup-admins-temp-route-delete-after', async (req, res) => {
  try {
    // SEMPRE deletar admins existentes e recriar
    const deleted = await User.deleteMany({ 
      email: { $in: ['wamber.pacheco.12@gmail.com', 'apgxavier@gmail.com'] } 
    });
    
    console.log(`🗑️ Deletados ${deleted.deletedCount} admins antigos`);

    // Criar admin 1 - O modelo vai fazer o hash automaticamente via pre('save')
    await User.create({
      name: 'Wamber Pacheco',
      email: 'wamber.pacheco.12@gmail.com',
      password: 'adim18272313', // Senha SEM hash - o modelo faz o hash
      role: 'admin',
      phone: '(92) 99999-0001',
      isActive: true,
      emailVerified: true,
    });

    // Criar admin 2
    const admin2 = await User.create({
      name: 'APG Xavier',
      email: 'apgxavier@gmail.com',
      password: 'adim18272313', // Senha SEM hash - o modelo faz o hash
      role: 'admin',
      phone: '(92) 99999-0002',
      isActive: true,
      emailVerified: true,
    });

    // Verificar se senhas foram hasheadas e testar login
    const testUser = await User.findOne({ email: 'wamber.pacheco.12@gmail.com' }).select('+password');
    const passwordTest = testUser ? await testUser.comparePassword('adim18272313') : false;

    res.json({
      success: true,
      message: 'Admins criados com sucesso!',
      credentials: {
        email1: 'wamber.pacheco.12@gmail.com',
        email2: 'apgxavier@gmail.com',
        password: 'adim18272313',
      },
      debug: {
        passwordHashExists: testUser ? (testUser.password ? true : false) : false,
        passwordTestResult: passwordTest,
        hashPreview: testUser && testUser.password ? testUser.password.substring(0, 20) + '...' : 'N/A',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar admins',
      error: error.message,
    });
  }
});

// Rota de debug para testar login
router.post('/debug-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.json({
        success: false,
        message: 'Usuário não encontrado',
        email,
      });
    }
    
    // Testar senha
    const isValid = await user.comparePassword(password);
    
    res.json({
      success: true,
      userFound: true,
      email: user.email,
      name: user.name,
      role: user.role,
      passwordValid: isValid,
      isLocked: user.isLocked,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      hasPassword: !!user.password,
      hashPreview: user.password.substring(0, 30) + '...',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Rota temporária de login sem validações (REMOVER APÓS USAR!)
router.post('/temp-login', async (req, res) => {
  try {
    const { generateToken, generateRefreshToken } = require('../config/auth');
    
    console.log('🔑 TEMP LOGIN - Body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios',
      });
    }
    
    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    console.log('🔍 User found:', !!user);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas',
      });
    }
    
    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas',
      });
    }
    
    // Gerar tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    
    // Atualizar usuário
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    console.log('✅ Login successful');
    
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isActive: user.isActive,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('❌ Temp login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message,
    });
  }
});

module.exports = router;
