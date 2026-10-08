import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory rate limiting map: ip -> last timestamp
const rateLimitMap = new Map<string, number>();

// In-memory backlog of pending leads in case Telegram bot hasn't been started yet
interface PendingLead {
  id: string;
  name: string;
  contact: string;
  serviceType: string;
  description: string;
  budget: string;
  timestamp: string;
}
const pendingLeads: PendingLead[] = [];

// Cached bot metadata
let botUsername = 'nightonuz_bot';

async function fetchBotInfo() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json() as { ok?: boolean; result?: { username?: string } };
    if (data.ok && data.result?.username) {
      botUsername = data.result.username;
      console.log(`[Telegram] Bot username identified as @${botUsername}`);
    }
  } catch (err) {
    console.error('[Telegram] Failed to fetch getMe:', err);
  }
}
fetchBotInfo();

// Clean up old rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of rateLimitMap.entries()) {
    if (now - timestamp > 60000) {
      rateLimitMap.delete(ip);
    }
  }
}, 600000);

// Helper to escape HTML characters safely for Telegram parse_mode: 'HTML'
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format local date string DD.MM.YYYY HH:mm
function getFormattedDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Helper to query getUpdates and auto-discover chat_id if available
async function tryAutoDiscoverChatId(token: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await res.json() as {
      ok?: boolean;
      result?: Array<{
        message?: { chat?: { id?: number | string; username?: string; type?: string } };
        channel_post?: { chat?: { id?: number | string } };
      }>;
    };
    if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
      for (const update of data.result.slice().reverse()) {
        const chat = update.message?.chat || update.channel_post?.chat;
        if (chat?.id) {
          return String(chat.id);
        }
      }
    }
  } catch (err) {
    console.warn('[Telegram] Could not auto-discover chat ID via getUpdates:', err);
  }
  return null;
}

// Contact form submission handler
async function handleContactSubmission(req: Request, res: Response) {
  try {
    const { name, contact, serviceType, description, budget, honeypot } = req.body || {};

    // 1. Honeypot check (anti-spam bot trap)
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(200).json({ success: true, message: 'Заявка принята' });
    }

    // 2. Validate mandatory fields
    if (
      !name ||
      typeof name !== 'string' ||
      !name.trim() ||
      !contact ||
      typeof contact !== 'string' ||
      !contact.trim() ||
      !serviceType ||
      typeof serviceType !== 'string' ||
      !serviceType.trim() ||
      !description ||
      typeof description !== 'string' ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Пожалуйста, заполните все обязательные поля (Имя, Контакт, Тип проекта, Описание).',
      });
    }

    // 3. Anti-spam minimum interval check (minimum 4 seconds per IP)
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const lastRequestTime = rateLimitMap.get(clientIp);
    const now = Date.now();

    if (lastRequestTime && now - lastRequestTime < 4000) {
      return res.status(429).json({
        success: false,
        error: 'Пожалуйста, подождите несколько секунд перед повторной отправкой.',
      });
    }
    rateLimitMap.set(clientIp, now);

    // Save lead into in-memory backup queue so lead is never lost
    pendingLeads.push({
      id: Date.now().toString(),
      name: name.trim(),
      contact: contact.trim(),
      serviceType: serviceType.trim(),
      description: description.trim(),
      budget: budget || '',
      timestamp: new Date().toISOString(),
    });

    // 4. Retrieve Telegram configuration
    const botToken = process.env.TELEGRAM_BOT_TOKEN ? process.env.TELEGRAM_BOT_TOKEN.trim() : null;
    let targetChatId = process.env.TELEGRAM_CHAT_ID ? process.env.TELEGRAM_CHAT_ID.replace(/['"]+/g, '').trim() : null;

    if (!botToken || !targetChatId) {
      console.warn(
        '[Telegram Integration] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in environment variables / AI Studio Secrets.'
      );
      return res.status(503).json({
        success: false,
        botUsername,
        error: 'Telegram-интеграция ожидает настройки TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в Secrets.',
      });
    }

    // 5. Build clean HTML formatted message
    const formattedDate = getFormattedDate();
    const cleanName = escapeHtml(name.trim());
    const cleanContact = escapeHtml(contact.trim());
    const cleanService = escapeHtml(serviceType.trim());
    const cleanBudget = budget && typeof budget === 'string' && budget.trim() ? escapeHtml(budget.trim()) : 'Не указан';
    const cleanDescription = escapeHtml(description.trim());

    const messageText = [
      `🌙 <b>NIGHTON — НОВАЯ ЗАЯВКА</b>`,
      ``,
      `👤 <b>Имя:</b> ${cleanName}`,
      `📱 <b>Контакт:</b> ${cleanContact}`,
      `💻 <b>Проект:</b> ${cleanService}`,
      `💰 <b>Бюджет:</b> ${cleanBudget}`,
      `📝 <b>Описание:</b>`,
      `${cleanDescription}`,
      ``,
      `🕐 <b>Дата:</b> ${formattedDate}`,
      `🌐 <b>Источник:</b> NIGHTON website`,
    ].join('\n');

    // 6. Send request to Telegram Bot API
    const telegramEndpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;

    let telegramResponse = await fetch(telegramEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    let telegramData = (await telegramResponse.json()) as { ok?: boolean; description?: string };

    // If chat not found, try auto-discovery from getUpdates (e.g. if user just pressed /start)
    if (!telegramData.ok && telegramData.description?.includes('chat not found')) {
      const discoveredId = await tryAutoDiscoverChatId(botToken);
      if (discoveredId && discoveredId !== targetChatId) {
        console.log(`[Telegram Integration] Auto-discovered chat ID: ${discoveredId}, retrying...`);
        telegramResponse = await fetch(telegramEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: discoveredId,
            text: messageText,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });
        telegramData = (await telegramResponse.json()) as { ok?: boolean; description?: string };
      }
    }

    if (!telegramResponse.ok || !telegramData.ok) {
      console.error(
        '[Telegram API Error] Failed to send message. Telegram description:',
        telegramData.description || 'Unknown error'
      );

      // Specific helpful message if user hasn't pressed /start yet
      if (telegramData.description?.includes('chat not found')) {
        return res.status(400).json({
          success: false,
          needsStart: true,
          botUsername,
          error: `Бот @${botUsername} пока не активирован: откройте в Telegram @${botUsername} и нажмите «Start» (/start). Заявка сохранена в системе!`,
        });
      }

      return res.status(502).json({
        success: false,
        botUsername,
        error: 'Не удалось доставить сообщение в Telegram. Заявка сохранена, вы также можете написать нам напрямую.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Заявка отправлена ✦',
    });
  } catch (error) {
    console.error('[Server Error] Internal error processing contact form.');
    return res.status(500).json({
      success: false,
      botUsername,
      error: 'Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую в Telegram.',
    });
  }
}

// API Routes
app.post('/api/contact', handleContactSubmission);
app.post('/api/orders', handleContactSubmission);

// Diagnostic status endpoint
app.get('/api/telegram-status', async (_req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN ? process.env.TELEGRAM_BOT_TOKEN.trim() : null;
  const chatId = process.env.TELEGRAM_CHAT_ID ? process.env.TELEGRAM_CHAT_ID.replace(/['"]+/g, '').trim() : null;

  if (!token) {
    return res.json({ configured: false, error: 'TELEGRAM_BOT_TOKEN missing in Secrets' });
  }

  try {
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const meData = await meRes.json() as { ok?: boolean; result?: { username?: string; first_name?: string } };

    const updatesRes = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const updatesData = await updatesRes.json() as { ok?: boolean; result?: Array<any> };

    return res.json({
      configured: true,
      botValid: meData.ok,
      botUsername: meData.result?.username,
      botName: meData.result?.first_name,
      configuredChatId: chatId ? `${chatId.slice(0, 3)}***${chatId.slice(-2)}` : null,
      recentUpdatesCount: Array.isArray(updatesData.result) ? updatesData.result.length : 0,
      recentUpdates: Array.isArray(updatesData.result)
        ? updatesData.result.slice(-3).map((u) => ({
            from: u.message?.from?.username || u.message?.from?.first_name,
            chatId: u.message?.chat?.id,
            text: u.message?.text,
          }))
        : [],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to query Telegram API' });
  }
});

// Setup Vite for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NIGHTON Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
