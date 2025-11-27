const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verificar conexão
transporter.verify((error, success) => {
  if (error) {
    logger.error(`Erro na configuração do email: ${error.message}`);
  } else {
    logger.info('Servidor de email pronto para enviar mensagens');
  }
});

// Template base de email
const getEmailTemplate = (title, content, buttonText, buttonUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #2ecc71;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          background: #f8f8f8;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .logo {
          font-size: 32px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌿</div>
          <h1>Coleta Verde Itacoatiara</h1>
        </div>
        <div class="content">
          ${content}
          ${buttonText && buttonUrl ? `
            <div style="text-align: center;">
              <a href="${buttonUrl}" class="button">${buttonText}</a>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>Sistema de Coleta de Lixo Verde - Itacoatiara-AM</p>
          <p>Este é um email automático, por favor não responda.</p>
          <p>Para dúvidas, entre em contato: ${process.env.EMAIL_FROM}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Enviar email genérico
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Coleta Verde Itacoatiara" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email enviado: ${info.messageId} para ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Erro ao enviar email para ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Email de boas-vindas
const sendWelcomeEmail = async (user) => {
  const content = `
    <h2>Bem-vindo(a), ${user.name}! 🎉</h2>
    <p>Obrigado por se cadastrar no Sistema de Coleta Verde de Itacoatiara.</p>
    <p>Sua conta foi criada com sucesso e você já pode começar a utilizar nossos serviços.</p>
    <p><strong>Seu perfil:</strong> ${user.role === 'citizen' ? 'Cidadão' : user.role === 'collector' ? 'Coletor' : 'Administrador'}</p>
    <p>Juntos, vamos tornar Itacoatiara mais verde e sustentável! 🌱</p>
  `;

  const html = getEmailTemplate(
    'Bem-vindo ao Coleta Verde',
    content,
    'Acessar Sistema',
    process.env.FRONTEND_URL
  );

  return await sendEmail(user.email, 'Bem-vindo ao Coleta Verde Itacoatiara', html);
};

// Email de notificação de coleta agendada
const sendCollectionScheduledEmail = async (citizen, collectionPoint, scheduledDate) => {
  const formattedDate = new Date(scheduledDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const content = `
    <h2>Coleta Agendada! 📅</h2>
    <p>Olá, ${citizen.name}!</p>
    <p>Sua coleta de lixo verde foi agendada com sucesso.</p>
    <div style="background: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>📍 Endereço:</strong> ${collectionPoint.address.street}, ${collectionPoint.address.number} - ${collectionPoint.address.neighborhood}</p>
      <p><strong>🗓️ Data prevista:</strong> ${formattedDate}</p>
      <p><strong>♻️ Tipo de resíduo:</strong> ${collectionPoint.wasteType}</p>
      <p><strong>⚖️ Peso estimado:</strong> ${collectionPoint.estimatedWeight} kg</p>
    </div>
    <p>Por favor, deixe o material em local de fácil acesso para o coletor.</p>
    <p><strong>Dica:</strong> Separe galhos, folhas e resíduos orgânicos em sacos ou amarrados.</p>
  `;

  const html = getEmailTemplate(
    'Coleta Agendada',
    content,
    'Ver Detalhes',
    `${process.env.FRONTEND_URL}/citizen/collection-points/${collectionPoint._id}`
  );

  return await sendEmail(citizen.email, 'Sua coleta foi agendada - Coleta Verde', html);
};

// Email de notificação de coleta realizada
const sendCollectionCompletedEmail = async (citizen, collectionPoint, checkIn) => {
  const collectedDate = new Date(checkIn.createdAt).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const content = `
    <h2>Coleta Realizada! ✅</h2>
    <p>Olá, ${citizen.name}!</p>
    <p>Sua coleta de lixo verde foi realizada com sucesso.</p>
    <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>📍 Endereço:</strong> ${collectionPoint.address.street}, ${collectionPoint.address.number}</p>
      <p><strong>🗓️ Data da coleta:</strong> ${collectedDate}</p>
      <p><strong>♻️ Material coletado:</strong> ${collectionPoint.wasteType}</p>
      <p><strong>⚖️ Peso coletado:</strong> ${collectionPoint.estimatedWeight} kg</p>
    </div>
    <p>Obrigado por contribuir com o meio ambiente! 🌍</p>
    <p>Seu lixo verde será destinado corretamente para compostagem ou reaproveitamento.</p>
  `;

  const html = getEmailTemplate(
    'Coleta Realizada',
    content,
    'Ver Histórico',
    `${process.env.FRONTEND_URL}/citizen/history`
  );

  return await sendEmail(citizen.email, 'Coleta realizada com sucesso - Coleta Verde', html);
};

// Email de lembrete de coleta (1 dia antes)
const sendCollectionReminderEmail = async (citizen, collectionPoint, scheduledDate) => {
  const formattedDate = new Date(scheduledDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const content = `
    <h2>Lembrete: Coleta Amanhã! ⏰</h2>
    <p>Olá, ${citizen.name}!</p>
    <p>Este é um lembrete de que sua coleta está agendada para <strong>amanhã</strong>.</p>
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>📍 Endereço:</strong> ${collectionPoint.address.street}, ${collectionPoint.address.number}</p>
      <p><strong>🗓️ Data:</strong> ${formattedDate}</p>
      <p><strong>♻️ Material:</strong> ${collectionPoint.wasteType}</p>
    </div>
    <p><strong>Prepare seu material:</strong></p>
    <ul>
      <li>Separe galhos, folhas e resíduos verdes</li>
      <li>Coloque em local de fácil acesso</li>
      <li>Evite misturar com outros tipos de lixo</li>
    </ul>
  `;

  const html = getEmailTemplate(
    'Lembrete de Coleta',
    content,
    'Ver Detalhes',
    `${process.env.FRONTEND_URL}/citizen/collection-points/${collectionPoint._id}`
  );

  return await sendEmail(citizen.email, 'Lembrete: Coleta amanhã - Coleta Verde', html);
};

// Email para coletor - nova rota atribuída
const sendNewRouteEmail = async (collector, route) => {
  const scheduledDate = new Date(route.scheduledDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const content = `
    <h2>Nova Rota Atribuída! 🚛</h2>
    <p>Olá, ${collector.name}!</p>
    <p>Uma nova rota foi atribuída a você.</p>
    <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>📋 Nome da rota:</strong> ${route.name}</p>
      <p><strong>🗓️ Data agendada:</strong> ${scheduledDate}</p>
      <p><strong>📍 Pontos de coleta:</strong> ${route.points.length}</p>
      <p><strong>📏 Distância estimada:</strong> ${route.estimatedDistance ? route.estimatedDistance.toFixed(2) + ' km' : 'A calcular'}</p>
    </div>
    <p>Acesse o sistema para ver os detalhes completos da rota e iniciar a coleta.</p>
  `;

  const html = getEmailTemplate(
    'Nova Rota Atribuída',
    content,
    'Ver Rota',
    `${process.env.FRONTEND_URL}/collector/routes/${route._id}`
  );

  return await sendEmail(collector.email, 'Nova rota atribuída - Coleta Verde', html);
};

// Email de redefinição de senha
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const content = `
    <h2>Redefinição de Senha 🔐</h2>
    <p>Olá, ${user.name}!</p>
    <p>Você solicitou a redefinição de sua senha.</p>
    <p>Clique no botão abaixo para criar uma nova senha:</p>
    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      <strong>Importante:</strong> Este link expira em 1 hora.
    </p>
    <p style="color: #666; font-size: 14px;">
      Se você não solicitou esta redefinição, ignore este email.
    </p>
  `;

  const html = getEmailTemplate(
    'Redefinição de Senha',
    content,
    'Redefinir Senha',
    resetUrl
  );

  return await sendEmail(user.email, 'Redefinição de senha - Coleta Verde', html);
};

// Email de relatório mensal para admin
const sendMonthlyReportEmail = async (admin, reportData) => {
  const content = `
    <h2>Relatório Mensal 📊</h2>
    <p>Olá, ${admin.name}!</p>
    <p>Aqui está o resumo das atividades do mês:</p>
    <div style="background: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>♻️ Total coletado:</strong> ${reportData.totalWeight} kg</p>
      <p><strong>📍 Pontos atendidos:</strong> ${reportData.totalPoints}</p>
      <p><strong>🚛 Distância percorrida:</strong> ${reportData.totalDistance} km</p>
      <p><strong>👷 Coletores ativos:</strong> ${reportData.activeCollectors}</p>
      <p><strong>👥 Novos cidadãos:</strong> ${reportData.newCitizens}</p>
    </div>
    <p>Acesse o sistema para ver o relatório completo com gráficos e análises detalhadas.</p>
  `;

  const html = getEmailTemplate(
    'Relatório Mensal',
    content,
    'Ver Relatório Completo',
    `${process.env.FRONTEND_URL}/admin/reports`
  );

  return await sendEmail(admin.email, 'Relatório Mensal - Coleta Verde', html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendCollectionScheduledEmail,
  sendCollectionCompletedEmail,
  sendCollectionReminderEmail,
  sendNewRouteEmail,
  sendPasswordResetEmail,
  sendMonthlyReportEmail,
};
