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
    await User.create({
      name: 'APG Xavier',
      email: 'apgxavier@gmail.com',
      password: 'adim18272313', // Senha SEM hash - o modelo faz o hash
      role: 'admin',
      phone: '(92) 99999-0002',
      isActive: true,
      emailVerified: true,
    });

    res.json({
      success: true,
      message: 'Admins criados com sucesso!',
      credentials: {
        email1: 'wamber.pacheco.12@gmail.com',
        email2: 'apgxavier@gmail.com',
        password: 'adim18272313',
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

module.exports = router;
