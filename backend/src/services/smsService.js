const twilio = require('twilio');
const logger = require('../utils/logger');

// Configurar cliente Twilio
let twilioClient = null;

try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    logger.info('Cliente Twilio configurado com sucesso');
  } else {
    logger.warn('Credenciais Twilio não configuradas - SMS desabilitado');
  }
} catch (error) {
  logger.error(`Erro ao configurar Twilio: ${error.message}`);
}

// Formatar número de telefone para padrão internacional
const formatPhoneNumber = (phone) => {
  // Remove caracteres não numéricos
  let cleaned = phone.replace(/\D/g, '');
  
  // Se não começar com código do país, adicionar +55 (Brasil)
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }
  
  // Adicionar + no início
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

// Enviar SMS genérico
const sendSMS = async (to, message) => {
  try {
    if (!twilioClient) {
      logger.warn('Twilio não configurado - SMS não enviado');
      return { success: false, error: 'Twilio não configurado' };
    }

    const formattedPhone = formatPhoneNumber(to);

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    logger.info(`SMS enviado: ${result.sid} para ${formattedPhone}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    logger.error(`Erro ao enviar SMS para ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// SMS de boas-vindas
const sendWelcomeSMS = async (user) => {
  const message = `🌿 Bem-vindo ao Coleta Verde Itacoatiara, ${user.name}! Sua conta foi criada com sucesso. Acesse: ${process.env.FRONTEND_URL}`;
  return await sendSMS(user.phone, message);
};

// SMS de coleta agendada
const sendCollectionScheduledSMS = async (citizen, collectionPoint, scheduledDate) => {
  const date = new Date(scheduledDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `🌿 Coleta Verde: Sua coleta foi agendada para ${date} em ${collectionPoint.address.street}, ${collectionPoint.address.number}. Prepare seu material!`;
  
  return await sendSMS(citizen.phone, message);
};

// SMS de coleta realizada
const sendCollectionCompletedSMS = async (citizen, collectionPoint) => {
  const message = `✅ Coleta Verde: Sua coleta em ${collectionPoint.address.street}, ${collectionPoint.address.number} foi realizada com sucesso! Obrigado por contribuir com o meio ambiente! 🌍`;
  
  return await sendSMS(citizen.phone, message);
};

// SMS de lembrete de coleta (1 dia antes)
const sendCollectionReminderSMS = async (citizen, collectionPoint, scheduledDate) => {
  const time = new Date(scheduledDate).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `⏰ Lembrete Coleta Verde: Sua coleta está agendada para AMANHÃ às ${time}. Endereço: ${collectionPoint.address.street}, ${collectionPoint.address.number}. Prepare o material!`;
  
  return await sendSMS(citizen.phone, message);
};

// SMS de coleta próxima (2 horas antes)
const sendCollectionImminentSMS = async (citizen, collectionPoint) => {
  const message = `🚛 Coleta Verde: O coletor está a caminho! Sua coleta será realizada em breve. Endereço: ${collectionPoint.address.street}, ${collectionPoint.address.number}.`;
  
  return await sendSMS(citizen.phone, message);
};

// SMS para coletor - nova rota
const sendNewRouteSMS = async (collector, route) => {
  const date = new Date(route.scheduledDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });

  const message = `🚛 Nova rota atribuída: "${route.name}" para ${date}. ${route.points.length} pontos. Acesse o sistema para detalhes.`;
  
  return await sendSMS(collector.phone, message);
};

// SMS para coletor - rota iniciada
const sendRouteStartedSMS = async (collector, route) => {
  const message = `✅ Rota "${route.name}" iniciada com sucesso! ${route.points.length} pontos para coletar. Boa coleta!`;
  
  return await sendSMS(collector.phone, message);
};

// SMS para coletor - rota concluída
const sendRouteCompletedSMS = async (collector, route, stats) => {
  const message = `🎉 Rota "${route.name}" concluída! Pontos coletados: ${stats.collected}/${stats.total}. Distância: ${stats.distance.toFixed(2)}km. Parabéns!`;
  
  return await sendSMS(collector.phone, message);
};

// SMS de código de verificação (2FA)
const sendVerificationCodeSMS = async (phone, code) => {
  const message = `🔐 Coleta Verde: Seu código de verificação é: ${code}. Válido por 10 minutos. Não compartilhe este código.`;
  
  return await sendSMS(phone, message);
};

// SMS de alerta de emergência para admin
const sendEmergencyAlertSMS = async (admin, collector, message) => {
  const alertMessage = `🚨 ALERTA: Coletor ${collector.name} reportou: ${message}. Verifique imediatamente!`;
  
  return await sendSMS(admin.phone, alertMessage);
};

// SMS de notificação de ponto cancelado
const sendPointCancelledSMS = async (citizen, collectionPoint, reason) => {
  const message = `❌ Coleta Verde: Sua coleta em ${collectionPoint.address.street}, ${collectionPoint.address.number} foi cancelada. Motivo: ${reason}. Entre em contato para reagendar.`;
  
  return await sendSMS(citizen.phone, message);
};

// SMS de alteração de horário
const sendScheduleChangedSMS = async (citizen, collectionPoint, newDate) => {
  const date = new Date(newDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `📅 Coleta Verde: O horário da sua coleta foi alterado para ${date}. Endereço: ${collectionPoint.address.street}, ${collectionPoint.address.number}.`;
  
  return await sendSMS(citizen.phone, message);
};

// Enviar SMS em lote
const sendBulkSMS = async (recipients, message) => {
  try {
    if (!twilioClient) {
      logger.warn('Twilio não configurado - SMS em lote não enviado');
      return { success: false, error: 'Twilio não configurado' };
    }

    const results = await Promise.allSettled(
      recipients.map(phone => sendSMS(phone, message))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    logger.info(`SMS em lote: ${successful} enviados, ${failed} falharam`);

    return {
      success: true,
      total: results.length,
      successful,
      failed,
      results,
    };
  } catch (error) {
    logger.error(`Erro ao enviar SMS em lote: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Verificar status de SMS
const checkSMSStatus = async (sid) => {
  try {
    if (!twilioClient) {
      return { success: false, error: 'Twilio não configurado' };
    }

    const message = await twilioClient.messages(sid).fetch();
    
    return {
      success: true,
      status: message.status,
      to: message.to,
      from: message.from,
      dateSent: message.dateSent,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    };
  } catch (error) {
    logger.error(`Erro ao verificar status do SMS ${sid}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendSMS,
  sendWelcomeSMS,
  sendCollectionScheduledSMS,
  sendCollectionCompletedSMS,
  sendCollectionReminderSMS,
  sendCollectionImminentSMS,
  sendNewRouteSMS,
  sendRouteStartedSMS,
  sendRouteCompletedSMS,
  sendVerificationCodeSMS,
  sendEmergencyAlertSMS,
  sendPointCancelledSMS,
  sendScheduleChangedSMS,
  sendBulkSMS,
  checkSMSStatus,
  formatPhoneNumber,
};
