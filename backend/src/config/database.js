const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Verificar se MONGODB_URI está definido
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI não está definido no arquivo .env');
    }

    // Mongoose v6+ no longer requires these options; pass the connection string only
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed inicial dos pontos de coleta (apenas na primeira execução)
    await seedPontosColeta();
    
    // Seed inicial das notícias (apenas na primeira execução)
    const seedNoticias = require('./seedNews');
    await seedNoticias();
    
    // Event listeners para monitoramento
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Função para popular pontos de coleta iniciais
async function seedPontosColeta() {
  try {
    const PontoColeta = require('../models/PontoColeta');
    
    // Verificar se já existem pontos cadastrados
    const count = await PontoColeta.countDocuments();
    
    if (count === 0) {
      logger.info('Populando banco de dados com pontos de coleta...');
      
      const pontosItacoatiara = [
        { nomePonto: 'Praça da Matriz', logradouro: 'Praça da Matriz', bairro: 'Centro', latitude: -3.1431, longitude: -58.4442 },
        { nomePonto: 'Av. Parque', logradouro: 'Avenida Parque', bairro: 'Centro', latitude: -3.1435, longitude: -58.4450 },
        { nomePonto: 'Hospital Regional', logradouro: 'Rua do Hospital', bairro: 'Centro', latitude: -3.1425, longitude: -58.4438 },
        { nomePonto: 'Porto de Itacoatiara', logradouro: 'Av. Beira Rio', bairro: 'Centro', latitude: -3.1420, longitude: -58.4460 },
        { nomePonto: 'Mercado Municipal', logradouro: 'Rua do Mercado', bairro: 'Centro', latitude: -3.1440, longitude: -58.4435 },
        { nomePonto: 'Praça 14 de Janeiro', logradouro: 'Rua Principal', bairro: 'Praça 14', latitude: -3.1380, longitude: -58.4420 },
        { nomePonto: 'Igreja São Sebastião', logradouro: 'Rua São Sebastião', bairro: 'Praça 14', latitude: -3.1385, longitude: -58.4415 },
        { nomePonto: 'Escola Estadual', logradouro: 'Av. Principal', bairro: 'Praça 14', latitude: -3.1390, longitude: -58.4425 },
        { nomePonto: 'UBS Praça 14', logradouro: 'Rua da Saúde', bairro: 'Praça 14', latitude: -3.1375, longitude: -58.4418 },
        { nomePonto: 'Campo de Futebol', logradouro: 'Rua do Estádio', bairro: 'Praça 14', latitude: -3.1395, longitude: -58.4430 },
        { nomePonto: 'Escola Municipal Iraci', logradouro: 'Rua Principal', bairro: 'Iraci', latitude: -3.1480, longitude: -58.4390 },
        { nomePonto: 'Posto de Saúde Iraci', logradouro: 'Av. Central', bairro: 'Iraci', latitude: -3.1485, longitude: -58.4385 },
        { nomePonto: 'Igreja Nossa Senhora', logradouro: 'Rua da Igreja', bairro: 'Iraci', latitude: -3.1475, longitude: -58.4395 },
        { nomePonto: 'Quadra Poliesportiva', logradouro: 'Rua do Esporte', bairro: 'Iraci', latitude: -3.1490, longitude: -58.4380 },
        { nomePonto: 'Terminal de Ônibus', logradouro: 'Av. Principal', bairro: 'Iraci', latitude: -3.1470, longitude: -58.4400 },
        { nomePonto: 'Praça Central Mamoud', logradouro: 'Rua Central', bairro: 'Mamoud Amed', latitude: -3.1350, longitude: -58.4380 },
        { nomePonto: 'Escola Mamoud Amed', logradouro: 'Av. Educação', bairro: 'Mamoud Amed', latitude: -3.1355, longitude: -58.4375 },
        { nomePonto: 'Mercadinho Local', logradouro: 'Rua do Comércio', bairro: 'Mamoud Amed', latitude: -3.1345, longitude: -58.4385 },
        { nomePonto: 'UBS Mamoud Amed', logradouro: 'Av. Saúde', bairro: 'Mamoud Amed', latitude: -3.1360, longitude: -58.4370 },
        { nomePonto: 'Igreja Assembleia', logradouro: 'Rua da Fé', bairro: 'Mamoud Amed', latitude: -3.1340, longitude: -58.4390 },
        { nomePonto: 'Centro Comunitário', logradouro: 'Av. Principal', bairro: 'Colônia', latitude: -3.1520, longitude: -58.4500 },
        { nomePonto: 'Posto Colônia', logradouro: 'Rua da Saúde', bairro: 'Colônia', latitude: -3.1525, longitude: -58.4495 },
        { nomePonto: 'Escola Rural', logradouro: 'Estrada da Colônia', bairro: 'Jauari', latitude: -3.1560, longitude: -58.4520 },
        { nomePonto: 'Porto do Jauari', logradouro: 'Rua do Porto', bairro: 'Jauari', latitude: -3.1555, longitude: -58.4525 },
        { nomePonto: 'Igreja do Jauari', logradouro: 'Rua Principal', bairro: 'Jauari', latitude: -3.1565, longitude: -58.4515 }
      ];
      
      // Distribuir status: 60% pendente, 25% em_andamento, 15% concluido
      const pontosComStatus = pontosItacoatiara.map((ponto, index) => {
        let status = 'pendente';
        if (index % 10 < 2) status = 'concluido';
        else if (index % 10 < 4) status = 'em_andamento';
        
        return { ...ponto, status };
      });
      
      await PontoColeta.insertMany(pontosComStatus);
      logger.info(`✅ ${pontosComStatus.length} pontos de coleta adicionados com sucesso`);
    } else {
      logger.info(`Banco já possui ${count} pontos de coleta cadastrados`);
    }
  } catch (error) {
    logger.error(`Erro ao popular pontos de coleta: ${error.message}`);
  }
}

module.exports = connectDB;
