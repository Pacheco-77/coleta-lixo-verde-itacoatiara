// Script para criar coletores no banco de produção
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
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.model('User', userSchema);

async function createColetores() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB Atlas (Produção)');

    // Deletar coletores de teste se existirem
    await User.deleteMany({ 
      email: { $in: [
        'coletor1@teste.com',
        'coletor2@teste.com',
        'coletor3@teste.com'
      ]} 
    });
    console.log('🗑️  Coletores de teste antigos removidos');

    // Hash da senha: Coletor@123
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Coletor@123', salt);

    const now = new Date();

    // Criar coletor 1
    const coletor1 = await User.create({
      name: 'João Silva',
      email: 'coletor1@teste.com',
      password: hashedPassword,
      role: 'coletor',
      phone: '(92) 98765-4321',
      isActive: true,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log('✅ Coletor 1 criado:', coletor1.email);

    // Criar coletor 2
    const coletor2 = await User.create({
      name: 'Maria Santos',
      email: 'coletor2@teste.com',
      password: hashedPassword,
      role: 'coletor',
      phone: '(92) 98765-4322',
      isActive: true,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log('✅ Coletor 2 criado:', coletor2.email);

    // Criar coletor 3
    const coletor3 = await User.create({
      name: 'Pedro Costa',
      email: 'coletor3@teste.com',
      password: hashedPassword,
      role: 'coletor',
      phone: '(92) 98765-4323',
      isActive: true,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log('✅ Coletor 3 criado:', coletor3.email);

    console.log('\n📋 CREDENCIAIS DOS COLETORES:');
    console.log('─────────────────────────────────');
    console.log('Email: coletor1@teste.com');
    console.log('Nome: João Silva');
    console.log('');
    console.log('Email: coletor2@teste.com');
    console.log('Nome: Maria Santos');
    console.log('');
    console.log('Email: coletor3@teste.com');
    console.log('Nome: Pedro Costa');
    console.log('─────────────────────────────────');
    console.log('Senha (todos): Coletor@123');
    console.log('');

    console.log('✅ Total de coletores criados: 3');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createColetores();
