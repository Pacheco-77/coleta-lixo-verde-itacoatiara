const mongoose = require('mongoose');
const News = require('../models/News');
const User = require('../models/User');
const logger = require('../utils/logger');

async function seedNoticias() {
  try {
    // Verificar se já existem notícias
    const count = await News.countDocuments();
    
    if (count > 0) {
      logger.info(`Banco já possui ${count} notícias cadastradas`);
      return;
    }

    logger.info('Populando banco de dados com notícias...');

    // Buscar um admin para ser autor
    let admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      logger.warn('Nenhum admin encontrado, criando admin padrão para notícias');
      admin = await User.create({
        name: 'Sistema Coleta Verde',
        email: 'sistema@coletaverde.com',
        password: 'Admin@123456',
        role: 'admin',
      });
    }

    const noticias = [
      {
        title: 'Sistema de Coleta Verde é Lançado em Itacoatiara',
        summary: 'Nova plataforma digital facilita o agendamento e acompanhamento da coleta de resíduos verdes na cidade.',
        content: `Itacoatiara agora conta com um sistema moderno e eficiente para gerenciar a coleta de lixo verde. A nova plataforma permite que cidadãos agendem coletas, acompanhem em tempo real e contribuam para uma cidade mais limpa e sustentável.

O sistema oferece:
- Mapa em tempo real dos pontos de coleta
- Agendamento online de coletas
- Notificações sobre dias de coleta
- Histórico de coletas realizadas
- Estatísticas de sustentabilidade

A iniciativa faz parte do programa de modernização da gestão ambiental municipal e está disponível gratuitamente para todos os cidadãos.`,
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
        category: 'noticia',
        priority: 10,
        author: admin._id,
        isActive: true,
        publishDate: new Date(),
      },
      {
        title: 'Mutirão de Limpeza no Centro Acontece Sábado',
        summary: 'Participe do mutirão de coleta de resíduos verdes no centro da cidade neste sábado às 8h.',
        content: `A Prefeitura de Itacoatiara convida todos os cidadãos para participar do grande mutirão de limpeza que acontecerá neste sábado, das 8h às 12h, na região central da cidade.

Pontos de encontro:
- Praça da Matriz - 8h
- Av. Parque - 9h
- Mercado Municipal - 10h

O que levar:
- Luvas de proteção
- Sacolas ou sacos de lixo
- Água e protetor solar
- Disposição para ajudar!

Todos os resíduos coletados serão destinados adequadamente. Ao final, haverá um café da manhã para todos os participantes. Venha fazer parte dessa ação pela nossa cidade!`,
        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
        category: 'evento',
        priority: 9,
        author: admin._id,
        isActive: true,
        publishDate: new Date(),
      },
      {
        title: 'Dicas para Separar Corretamente o Lixo Verde',
        summary: 'Aprenda a identificar e separar resíduos verdes para facilitar a coleta e aumentar a reciclagem.',
        content: `O lixo verde ou resíduo orgânico é composto principalmente por materiais de origem vegetal. Saiba como separar corretamente:

O que é lixo verde:
✅ Folhas secas e galhos
✅ Grama cortada
✅ Restos de poda de árvores
✅ Flores murchas
✅ Cascas de frutas e legumes
✅ Restos de plantas

O que NÃO é lixo verde:
❌ Alimentos cozidos
❌ Carnes e laticínios
❌ Plásticos e metais
❌ Vidros
❌ Papel e papelão

Dicas importantes:
1. Armazene em local arejado
2. Não misture com outros resíduos
3. Agende a coleta quando tiver volume
4. Evite deixar muito tempo acumulado

A separação correta ajuda na compostagem e reduz o impacto ambiental!`,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        category: 'informacao',
        priority: 8,
        author: admin._id,
        isActive: true,
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      },
      {
        title: 'Atenção: Coletas Suspensas no Feriado',
        summary: 'Não haverá coleta de lixo verde nos dias 7 e 8 de dezembro devido ao feriado municipal.',
        content: `Informamos que as coletas de lixo verde estarão suspensas nos dias 7 e 8 de dezembro (quinta e sexta-feira) devido ao feriado municipal.

Programação:
- Última coleta antes do feriado: 6 de dezembro (quarta)
- Retorno das atividades: 9 de dezembro (sábado)

Orientações:
- Não deixe resíduos na calçada durante o feriado
- Agende sua coleta para após o dia 9
- Em caso de emergência, entre em contato pelo telefone

Pedimos a compreensão de todos e desejamos um ótimo feriado!`,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        category: 'alerta',
        priority: 10,
        author: admin._id,
        isActive: true,
        publishDate: new Date(),
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Expira em 10 dias
      },
      {
        title: 'Bairro Praça 14 Recebe Composteira Comunitária',
        summary: 'Moradores do bairro Praça 14 agora têm acesso a composteira para transformar resíduos verdes em adubo.',
        content: `O bairro Praça 14 inaugurou nesta semana sua primeira composteira comunitária, um projeto piloto que visa transformar resíduos verdes em adubo orgânico de qualidade.

Localização:
Rua Principal, próximo à Escola Estadual

Como funciona:
1. Moradores depositam resíduos verdes
2. Equipe técnica gerencia a compostagem
3. Adubo produzido é distribuído gratuitamente
4. Pode ser usado em hortas e jardins

Benefícios:
- Redução de resíduos no aterro
- Produção de adubo natural
- Educação ambiental
- Economia para moradores

O projeto pode ser expandido para outros bairros dependendo do sucesso desta primeira fase. Participe!`,
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
        category: 'noticia',
        priority: 7,
        author: admin._id,
        isActive: true,
        publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
      },
    ];

    await News.insertMany(noticias);
    logger.info(`✅ ${noticias.length} notícias adicionadas com sucesso`);
  } catch (error) {
    logger.error(`Erro ao popular notícias: ${error.message}`);
  }
}

module.exports = seedNoticias;
