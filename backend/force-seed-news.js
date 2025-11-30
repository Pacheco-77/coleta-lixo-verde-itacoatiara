require('dotenv').config();
const mongoose = require('mongoose');
const seedNoticias = require('./src/config/seedNews');

async function forceSeedNews() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    console.log('📰 Forçando seed de notícias...');
    
    // Verificar quantas notícias existem
    const News = require('./src/models/News');
    const count = await News.countDocuments();
    console.log(`📊 Notícias existentes no banco: ${count}`);
    
    if (count === 0) {
      console.log('🌱 Criando notícias...');
      await seedNoticias();
    } else {
      console.log('⚠️  Já existem notícias no banco.');
      console.log('💡 Para recriar, delete as notícias existentes primeiro.');
      
      // Listar notícias existentes
      const news = await News.find().select('title category isActive');
      console.log('\n📋 Notícias cadastradas:');
      news.forEach((n, i) => {
        console.log(`${i + 1}. [${n.category}] ${n.title} - ${n.isActive ? '✅ Ativa' : '❌ Inativa'}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

forceSeedNews();
