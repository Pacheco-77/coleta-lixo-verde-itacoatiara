// Script para criar admins no banco de produção
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  isActive: Boolean,
  emailVerified: Boolean,
});

const User = mongoose.model('User', userSchema);

async function createAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB Atlas (Produção)');

    // Deletar admins antigos se existirem
    await User.deleteMany({ 
      email: { $in: ['wamber.pacheco.12@gmail.com', 'apgxavier@gmail.com'] } 
    });
    console.log('🗑️  Admins antigos removidos');

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adim18272313', salt);
    console.log('🔒 Senha hasheada:', hashedPassword.substring(0, 30) + '...');

    // Criar admin 1
    const admin1 = await User.create({
      name: 'Wamber Pacheco',
      email: 'wamber.pacheco.12@gmail.com',
      password: hashedPassword,
      role: 'admin',
      phone: '(92) 99999-0001',
      isActive: true,
      emailVerified: true,
    });
    console.log('✅ Admin 1 criado:', admin1.email);

    // Criar admin 2
    const admin2 = await User.create({
      name: 'APG Xavier',
      email: 'apgxavier@gmail.com',
      password: hashedPassword,
      role: 'admin',
      phone: '(92) 99999-0002',
      isActive: true,
      emailVerified: true,
    });
    console.log('✅ Admin 2 criado:', admin2.email);

    console.log('\n📋 CREDENCIAIS:');
    console.log('Email: wamber.pacheco.12@gmail.com');
    console.log('Email: apgxavier@gmail.com');
    console.log('Senha: adim18272313');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createAdmins();
