const logger = require('../utils/logger');
const { formatPhoneNumber } = require('./smsService');

// Nota: Este é um serviço simulado para WhatsApp
// Para implementação real, você precisará de:
// 1. WhatsApp Business API (oficial)
// 2. Twilio WhatsApp API
// 3. Ou serviços como Baileys, Venom-bot, etc.

// Configuração do WhatsApp Business API
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
const WHATSAPP_BUSINESS_NUMBER = process.env.WHATSAPP_BUSINESS_NUMBER;

// Gerar link do WhatsApp
const generateWhatsAppLink = (phone, message) => {
  const formattedPhone = formatPhoneNumber(phone).replace('+', '');
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_API_URL}?phone=${formattedPhone}&text=${encodedMessage}`;
};

// Enviar mensagem via WhatsApp (simulado)
// Em produção, isso seria uma chamada real à API do WhatsApp Business
const sendWhatsAppMessage = async (to, message) => {
  try {
    // Simulação de envio
    logger.info(`WhatsApp simulado enviado para ${to}: ${message.substring(0, 50)}...`);
    
    // Em produção, aqui você faria a chamada real à API
    // Exemplo com Twilio WhatsApp:
    /*
    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);
    
    const result = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${formatPhoneNumber(to)}`,
      body: message
    });
    */

    return {
      success: true,
      messageId: `whatsapp_${Date.now()}`,
      link: generateWhatsAppLink(to, message),
    };
  } catch (error) {
    logger.error(`Erro ao enviar WhatsApp para ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Mensagem de boas-vindas
const sendWelcomeWhatsApp = async (user) => {
  const message = `🌿 *Bem-vindo ao Coleta Verde Itacoatiara!*

Olá, ${user.name}! 👋

Sua conta foi criada com sucesso e você já pode começar a utilizar nossos serviços.

*Seu perfil:* ${user.role === 'citizen' ? 'Cidadão' : user.role === 'collector' ? 'Coletor' : 'Administrador'}

Juntos, vamos tornar Itacoatiara mais verde e sustentável! 🌱

Acesse: ${process.env.FRONTEND_URL}`;

  return await sendWhatsAppMessage(user.phone, message);
};

// Mensagem de coleta agendada
const sendCollectionScheduledWhatsApp = async (citizen, collectionPoint, scheduledDate) => {
  const formattedDate = new Date(scheduledDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `🌿 *Coleta Agendada!*

Olá, ${citizen.name}! 📅

Sua coleta de lixo verde foi agendada com sucesso.

*Detalhes da Coleta:*
📍 *Endereço:* ${collectionPoint.address.street}, ${collectionPoint.address.number} - ${collectionPoint.address.neighborhood}
🗓️ *Data prevista:* ${formattedDate}
♻️ *Tipo de resíduo:* ${collectionPoint.wasteType}
⚖️ *Peso estimado:* ${collectionPoint.estimatedWeight} kg

*Importante:*
✅ Deixe o material em local de fácil acesso
✅ Separe galhos, folhas e resíduos orgânicos
✅ Evite misturar com outros tipos de lixo

Obrigado por contribuir com o meio ambiente! 🌍`;

  return await sendWhatsAppMessage(citizen.phone, message);
};

// Mensagem de coleta realizada
const sendCollectionCompletedWhatsApp = async (citizen, collectionPoint, checkIn) => {
  const collectedDate = new Date(checkIn.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `✅ *Coleta Realizada com Sucesso!*

Olá, ${citizen.name}! 🎉

Sua coleta de lixo verde foi realizada.

*Detalhes:*
📍 *Local:* ${collectionPoint.address.street}, ${collectionPoint.address.number}
🗓️ *Data:* ${collectedDate}
♻️ *Material:* ${collectionPoint.wasteType}
⚖️ *Peso:* ${collectionPoint.estimatedWeight} kg

Seu lixo verde será destinado corretamente para compostagem ou reaproveitamento.

*Obrigado por contribuir com o meio ambiente!* 🌍💚

Continue colaborando com a sustentabilidade de Itacoatiara! 🌿`;

  return await sendWhatsAppMessage(citizen.phone, message);
};

// Mensagem de lembrete de coleta
const sendCollectionReminderWhatsApp = async (citizen, collectionPoint, scheduledDate) => {
  const formattedDate = new Date(scheduledDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `⏰ *Lembrete: Coleta Amanhã!*

Olá, ${citizen.name}! 

Sua coleta está agendada para *AMANHÃ*:

📍 *Endereço:* ${collectionPoint.address.street}, ${collectionPoint.address.number}
🗓️ *Horário:* ${formattedDate}
♻️ *Material:* ${collectionPoint.wasteType}

*Prepare seu material:*
✅ Separe galhos, folhas e resíduos verdes
✅ Coloque em local de fácil acesso
✅ Evite misturar com outros tipos de lixo

Até amanhã! 🌿`;

  return await sendWhatsAppMessage(citizen.phone, message);
};

// Mensagem de coleta iminente (coletor a caminho)
const sendCollectionImminentWhatsApp = async (citizen, collectionPoint, estimatedTime) => {
  const message = `🚛 *Coletor a Caminho!*

Olá, ${citizen.name}! 

O coletor está se aproximando do seu endereço!

📍 *Local:* ${collectionPoint.address.street}, ${collectionPoint.address.number}
⏱️ *Tempo estimado:* ${estimatedTime} minutos

Por favor, certifique-se de que o material está em local acessível.

Obrigado! 🌿`;

  return await sendWhatsAppMessage(citizen.phone, message);
};

// Mensagem para coletor - nova rota
const sendNewRouteWhatsApp = async (collector, route) => {
  const scheduledDate = new Date(route.scheduledDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  const message = `🚛 *Nova Rota Atribuída!*

Olá, ${collector.name}! 

Uma nova rota foi atribuída a você:

📋 *Nome:* ${route.name}
🗓️ *Data:* ${scheduledDate}
📍 *Pontos:* ${route.points.length}
📏 *Distância:* ${route.estimatedDistance ? route.estimatedDistance.toFixed(2) + ' km' : 'A calcular'}

Acesse o sistema para ver os detalhes completos e iniciar a coleta.

${process.env.FRONTEND_URL}/collector/routes/${route._id}

Boa coleta! 🌿`;

  return await sendWhatsAppMessage(collector.phone, message);
};

// Mensagem de rota concluída
const sendRouteCompletedWhatsApp = async (collector, route, stats) => {
  const message = `🎉 *Rota Concluída!*

Parabéns, ${collector.name}! 

Você concluiu a rota "${route.name}"!

*Estatísticas:*
✅ *Pontos coletados:* ${stats.collected}/${stats.total}
📏 *Distância percorrida:* ${stats.distance.toFixed(2)} km
⏱️ *Tempo total:* ${stats.duration}
⚖️ *Peso coletado:* ${stats.weight} kg

Excelente trabalho! Continue assim! 💪🌿`;

  return await sendWhatsAppMessage(collector.phone, message);
};

// Mensagem de alteração de horário
const sendScheduleChangedWhatsApp = async (citizen, collectionPoint, newDate, reason) => {
  const formattedDate = new Date(newDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `📅 *Alteração de Horário*

Olá, ${citizen.name}! 

O horário da sua coleta foi alterado:

📍 *Endereço:* ${collectionPoint.address.street}, ${collectionPoint.address.number}
🗓️ *Novo horário:* ${formattedDate}
${reason ? `📝 *Motivo:* ${reason}` : ''}

Pedimos desculpas pelo inconveniente.

Obrigado pela compreensão! 🌿`;

  return await sendWhatsAppMessage(citizen.phone, message);
};

// Mensagem de ponto cancelado
const sendPointCancelledWhatsApp = async (citizen, collectionPoint, reason) => {
  const message = `❌ *Coleta Cancelada*

Olá, ${citizen.name}! 

Infelizmente, sua coleta foi cancelada:

📍 *Endereço:* ${collectionPoint.address.street}, ${collectionPoint.address.number}
📝 *Motivo:* ${reason}

Para reagendar, entre em contato conosco ou acesse o sistema.

*Contato:* ${WHATSAPP_BUSINESS_NUMBER}

Pedimos desculpas pelo inconveniente. 🙏`;

  return await sendWhatsAppMessage(citizen.phone, message);
};

// Mensagem de alerta de emergência
const sendEmergencyAlertWhatsApp = async (admin, collector, alertMessage, location) => {
  const message = `🚨 *ALERTA DE EMERGÊNCIA*

Administrador ${admin.name},

O coletor *${collector.name}* reportou uma emergência:

📝 *Mensagem:* ${alertMessage}
📍 *Localização:* ${location ? `Lat: ${location.coordinates[1]}, Lng: ${location.coordinates[0]}` : 'Não disponível'}
⏰ *Horário:* ${new Date().toLocaleString('pt-BR')}

*AÇÃO NECESSÁRIA IMEDIATAMENTE!*

Verifique o sistema para mais detalhes.`;

  return await sendWhatsAppMessage(admin.phone, message);
};

// Mensagem de feedback/avaliação
const sendFeedbackRequestWhatsApp = async (citizen, collectionPoint) => {
  const message = `⭐ *Avalie Nossa Coleta*

Olá, ${citizen.name}! 

Como foi sua experiência com nossa coleta?

📍 *Local:* ${collectionPoint.address.street}, ${collectionPoint.address.number}

Sua opinião é muito importante para melhorarmos nossos serviços!

Acesse: ${process.env.FRONTEND_URL}/feedback/${collectionPoint._id}

Obrigado! 🌿`;

  return await sendWhatsAppMessage(citizen.phone, message);
};

// Mensagem de dicas de sustentabilidade
const sendSustainabilityTipWhatsApp = async (user, tip) => {
  const message = `💡 *Dica de Sustentabilidade*

Olá, ${user.name}! 

${tip.emoji} *${tip.title}*

${tip.description}

*Você sabia?*
${tip.fact}

Juntos por um Itacoatiara mais verde! 🌿🌍

#ColetaVerde #Sustentabilidade`;

  return await sendWhatsAppMessage(user.phone, message);
};

// Gerar link de contato direto
const generateContactLink = (message = '') => {
  if (!WHATSAPP_BUSINESS_NUMBER) {
    return null;
  }
  return generateWhatsAppLink(WHATSAPP_BUSINESS_NUMBER, message);
};

// Enviar mensagem em lote
const sendBulkWhatsApp = async (recipients, message) => {
  try {
    const results = await Promise.allSettled(
      recipients.map(phone => sendWhatsAppMessage(phone, message))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    logger.info(`WhatsApp em lote: ${successful} enviados, ${failed} falharam`);

    return {
      success: true,
      total: results.length,
      successful,
      failed,
      results,
    };
  } catch (error) {
    logger.error(`Erro ao enviar WhatsApp em lote: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWhatsAppMessage,
  sendWelcomeWhatsApp,
  sendCollectionScheduledWhatsApp,
  sendCollectionCompletedWhatsApp,
  sendCollectionReminderWhatsApp,
  sendCollectionImminentWhatsApp,
  sendNewRouteWhatsApp,
  sendRouteCompletedWhatsApp,
  sendScheduleChangedWhatsApp,
  sendPointCancelledWhatsApp,
  sendEmergencyAlertWhatsApp,
  sendFeedbackRequestWhatsApp,
  sendSustainabilityTipWhatsApp,
  generateContactLink,
  generateWhatsAppLink,
  sendBulkWhatsApp,
};
