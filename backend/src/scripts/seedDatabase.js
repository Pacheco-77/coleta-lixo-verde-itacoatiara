require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const News = require('../models/News');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB conectado para seed');
  } catch (error) {
    logger.error(`Erro ao conectar MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmins = async () => {
  try {
    // Verificar se admins já existem
    const admin1 = await User.findOne({ email: 'wamber.pacheco.12@gmail.com' });
    const admin2 = await User.findOne({ email: 'apgxavier@gmail.com' });

    if (!admin1) {
      await User.create({
        name: 'Wamber Pacheco',
        email: 'wamber.pacheco.12@gmail.com',
        password: 'adim18272313',
        role: 'admin',
        phone: '(92) 99999-0001',
        isActive: true,
        emailVerified: true,
      });
      logger.info('✅ Admin 1 criado: wamber.pacheco.12@gmail.com');
    } else {
      logger.info('ℹ️  Admin 1 já existe');
    }

    if (!admin2) {
      await User.create({
        name: 'APG Xavier',
        email: 'apgxavier@gmail.com',
        password: 'adim18272313',
        role: 'admin',
        phone: '(92) 99999-0002',
        isActive: true,
        emailVerified: true,
      });
      logger.info('✅ Admin 2 criado: apgxavier@gmail.com');
    } else {
      logger.info('ℹ️  Admin 2 já existe');
    }
  } catch (error) {
    logger.error(`Erro ao criar admins: ${error.message}`);
  }
};

const seedNews = async () => {
  try {
    const newsCount = await News.countDocuments();
    
    if (newsCount > 0) {
      logger.info('ℹ️  Notícias já existem no banco');
      return;
    }

    // Buscar um admin para ser autor
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      logger.warn('⚠️  Nenhum admin encontrado para ser autor das notícias');
      return;
    }

    const newsData = [
      {
        title: 'Bem-vindo ao Sistema de Coleta de Lixo Verde',
        content: 'O Sistema de Coleta de Lixo Verde de Itacoatiara está agora disponível! Agende suas coletas de forma fácil e rápida através da nossa plataforma.',
        summary: 'Sistema de coleta agora disponível para todos os moradores',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
        category: 'noticia',
        priority: 10,
        author: admin._id,
      },
      {
        title: 'Como Separar Seu Lixo Verde Corretamente',
        content: 'Aprenda a separar corretamente folhas, galhos, grama e outros resíduos verdes para facilitar a coleta e contribuir com o meio ambiente.',
        summary: 'Dicas importantes para separação de resíduos verdes',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        category: 'informacao',
        priority: 8,
        author: admin._id,
      },
      {
        title: 'Mutirão de Limpeza no Bairro Centro',
        content: 'Participe do mutirão de limpeza que acontecerá no próximo sábado, das 8h às 12h, no Bairro Centro. Traga sua família!',
        summary: 'Mutirão de limpeza neste sábado',
        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
        category: 'evento',
        priority: 9,
        author: admin._id,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
      {
        title: 'Atenção: Coleta Suspensa na Próxima Segunda',
        content: 'Devido ao feriado, a coleta de lixo verde será suspensa na próxima segunda-feira. O serviço retorna normalmente na terça-feira.',
        summary: 'Coleta suspensa no feriado',
        image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
        category: 'alerta',
        priority: 10,
        author: admin._id,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
      },
      {
        title: 'Itacoatiara Reduz 30% do Lixo Verde em Aterros',
        content: 'Graças ao programa de coleta seletiva, a cidade conseguiu reduzir em 30% a quantidade de lixo verde enviado aos aterros sanitários.',
        summary: 'Programa de coleta alcança resultados positivos',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        category: 'noticia',
        priority: 7,
        author: admin._id,
      },
    ];

    await News.insertMany(newsData);
    logger.info(`✅ ${newsData.length} notícias criadas com sucesso`);
  } catch (error) {
    logger.error(`Erro ao criar notícias: ${error.message}`);
  }
};

const seedTestUsers = async () => {
  try {
    // Criar usuário comum de teste
    const testUser = await User.findOne({ email: 'usuario@teste.com' });
    if (!testUser) {
      await User.create({
        name: 'Usuário Teste',
        email: 'usuario@teste.com',
        password: 'senha123',
        role: 'user',
        phone: '(92) 99999-1111',
        address: {
          street: 'Rua Teste',
          number: '123',
          neighborhood: 'Centro',
          city: 'Itacoatiara',
          state: 'AM',
        },
        isActive: true,
        emailVerified: true,
      });
      logger.info('✅ Usuário teste criado: usuario@teste.com / senha123');
    }

    // Criar coletor de teste
    const testCollector = await User.findOne({ email: 'coletor@teste.com' });
    if (!testCollector) {
      await User.create({
        name: 'Coletor Teste',
        email: 'coletor@teste.com',
        password: 'senha123',
        role: 'coletor',
        phone: '(92) 99999-2222',
        cpf: '12345678901',
        collectorInfo: {
          vehiclePlate: 'ABC-1234',
          vehicleType: 'truck',
          isActive: true,
        },
        isActive: true,
        emailVerified: true,
      });
      logger.info('✅ Coletor teste criado: coletor@teste.com / senha123');
    }
  } catch (error) {
    logger.error(`Erro ao criar usuários de teste: ${error.message}`);
  }
};

const runSeed = async () => {
  try {
    logger.info('🌱 Iniciando seed do banco de dados...');
    
    await connectDB();
    
    await seedAdmins();
    await seedTestUsers();
    await seedNews();
    
    logger.info('✅ Seed concluído com sucesso!');
    logger.info('\n📝 Credenciais criadas:');
    logger.info('   Admin 1: wamber.pacheco.12@gmail.com / adim18272313');
    logger.info('   Admin 2: apgxavier@gmail.com / adim18272313');
    logger.info('   Usuário: usuario@teste.com / senha123');
    logger.info('   Coletor: coletor@teste.com / senha123');
    
    process.exit(0);
  } catch (error) {
    logger.error(`Erro no seed: ${error.message}`);
    process.exit(1);
  }
};

// Executar seed
runSeed();
