const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Rota temporária para criar admins (REMOVER APÓS USAR!)
router.post('/setup-admins-temp-route-delete-after', async (req, res) => {
  try {
    // Verificar se já existem admins
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.json({
        success: false,
        message: 'Admins já existem. Use esta rota apenas uma vez!',
      });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adim18272313', salt);

    // Criar admin 1
    await User.create({
      name: 'Wamber Pacheco',
      email: 'wamber.pacheco.12@gmail.com',
      password: hashedPassword,
      role: 'admin',
      phone: '(92) 99999-0001',
      isActive: true,
      emailVerified: true,
    });

    // Criar admin 2
    await User.create({
      name: 'APG Xavier',
      email: 'apgxavier@gmail.com',
      password: hashedPassword,
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
