require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Configuration
const { TOKEN, SERVER_URL, PORT } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Initialize Telegram Bot
const bot = new TelegramBot(TOKEN, { 
  polling: true,
  request: {
    proxy: process.env.PROXY || null
  }
});

// Menu
const replyKeyboard = {
  reply_markup: {
    keyboard: [
      ['🏢 О компании', '🛠 Специализации'],
      ['🏗 Проекты', '📍 Офисы на карте'],
      ['📞 Контакты']
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

// Map
const offices = [
  {
    title: "Головной офис ANTARES ENGINEERING",
    address: "ул. Карасай батыра 1А, Алматы",
    lat: 43.238949,
    lng: 76.889709
  }
];

// Keyboard Markups 
const mainMenuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '🏢 О компании', callback_data: 'about' }],
      [{ text: '🛠 Специализации', callback_data: 'specialization' }],
      [{ text: '🏗 Наши проекты', callback_data: 'projects' }],
      [{ text: '📞 Контакты', callback_data: 'contact' }]
    ]
  }
};

const backToMainMenuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
    ]
  }
};

// Bot responses (оригинальные тексты без изменений)
const responses = {
  start: `🌟 <b>Добро пожаловать в ANTARES ENGINEERING!</b> 🌟

Я рад приветствовать Вас в команде ведущей строительно-монтажной компании Казахстана!

Наша миссия — создавать надежные и инновационные инженерные решения, способствующие развитию инфраструктуры и технологий.`,

  about: `🏢 <b>О компании ANTARES ENGINEERING</b>

ТОО "ANTARES ENGINEERING" - строительно-монтажная компания с более чем 10-летним опытом работы.

🔹 Профессиональная реализация крупных проектов
🔹 Внимание к деталям и индивидуальный подход
🔹 Соответствие высочайшим стандартам качества
🔹 Надежные и эффективные инженерные решения

Мы не просто строим - мы создаем будущее!`,

  specialization: `📌 <b>Наши специализации:</b>

• Строительное проектирование и реконструкция
• Системы автоматизации и диспетчеризации
• Видеонаблюдение и аналитика
• Проектирование и сооружение сетей
• Дистрибьюция строительных материалов
• Техническая поддержка объектов связи
• Строительство телекоммуникационной инфраструктуры
• Ремонтные и монтажные работы
• Электро- и теплоэнергетическое оборудование
• Альтернативная энергетика (ВИЭ)`,
  
  projects: `🏗 <b>Наши проекты:</b>

• <b>SMART NATIONAL PARK BURABAY</b> - Система раннего распознавания лесных пожаров
• Система обнаружения пожаров в Алматы (Медео, Шымбулак)
• <b>ГЛПР ЕРТIС ОРМАНЫ</b> - система обнаружения (277 961 га)
• <b>BEELINE, ALTEL TELE2</b> - строительство сетей связи
• Строительство и ремонт школ и спортплощадок
• <b>КазНТУ им. Сатпаева</b> - система видеонаблюдения (254 камеры)`,
  
  contact: `📞 <b>Контактная информация:</b>

<b>Телефоны:</b>
+7 (727) 339 30 87
+7 (747) 505 37 77
+7 (777) 777 07 44

<b>Email:</b> antares.engineering@bk.ru

<b>Адрес:</b>
050012, Казахстан, г. Алматы,
ул. Карасай батыра 1А

📍 <a href="https://maps.google.com">Посмотреть на карте</a>`
};

// Initialize webhook
const initWebhook = async () => {
  try {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log('Webhook setup:', res.data);
  } catch (error) {
    console.error('Error setting up webhook:', error.message);
  }
};

// Webhook handler
app.post(URI, async (req, res) => {
  try {
    console.log('Received update:', req.body);
    res.send();
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send();
  }
});

// Handle /start command (обновлено с replyKeyboard)
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, responses.start, {
    parse_mode: 'HTML',
    reply_markup: replyKeyboard.reply_markup
  });
});

// Handle callback queries (button presses) - оригинальная логика без изменений
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  switch(query.data) {
    case 'main_menu':
      bot.editMessageText(responses.start, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: mainMenuKeyboard.reply_markup
      });
      break;
      
    case 'about':
      bot.editMessageText(responses.about, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: backToMainMenuKeyboard.reply_markup
      });
      break;
      
    case 'specialization':
      bot.editMessageText(responses.specialization, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: backToMainMenuKeyboard.reply_markup
      });
      break;
      
    case 'projects':
      bot.editMessageText(responses.projects, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: backToMainMenuKeyboard.reply_markup
      });
      break;
      
    case 'contact':
      bot.editMessageText(responses.contact, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: backToMainMenuKeyboard.reply_markup
      });
      break;
  }
  
  bot.answerCallbackQuery(query.id);
});

// Handle reply keyboard buttons (НОВОЕ: обработка кнопок под строкой ввода)
bot.on('message', (msg) => {
  const text = msg.text;
  
  if (text.startsWith('/')) return; // Пропускаем команды

  switch(text) {
    case '🏢 О компании':
      bot.sendMessage(msg.chat.id, responses.about, {
        parse_mode: 'HTML',
        reply_markup: replyKeyboard.reply_markup
      });
      break;
      
    case '🛠 Специализации':
      bot.sendMessage(msg.chat.id, responses.specialization, {
        parse_mode: 'HTML',
        reply_markup: replyKeyboard.reply_markup
      });
      break;
      
    case '🏗 Проекты':
      bot.sendMessage(msg.chat.id, responses.projects, {
        parse_mode: 'HTML',
        reply_markup: replyKeyboard.reply_markup
      });
      break;
      
    case '📍 Офисы на карте':
      // Отправка всех офисов на карте (НОВОЕ)
      offices.forEach(office => {
        bot.sendVenue(
          msg.chat.id,
          office.lat,
          office.lng,
          office.title,
          office.address
        );
      });
      break;
      
    case '📞 Контакты':
      bot.sendMessage(msg.chat.id, responses.contact, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: replyKeyboard.reply_markup
      });
      break;
      
    default:
      if (!msg.text.startsWith('/')) {
        bot.sendMessage(msg.chat.id, 'Пожалуйста, используйте кнопки меню для навигации.', {
          reply_markup: replyKeyboard.reply_markup
        });
      }
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Start server
app.listen(PORT || 5000, async () => {
  console.log(`🚀 Server running on port ${PORT || 5000}`);
  await initWebhook();
});