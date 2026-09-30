const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   TELEGRAM BOT
========================= */

const BOT_TOKEN =8669113896:AAHSbZASGWAf05QthiuPmSp62zbmBSHPHLc process.env.BOT_TOKEN;
const ADMIN_CHAT_ID =8567050757 process.env.ADMIN_CHAT_ID;

if (!BOT_TOKEN) {
  console.log("❌ BOT_TOKEN hin jiru");
} else {
  const bot = new TelegramBot(BOT_TOKEN, {
    polling: true
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    console.log("Telegram message:", text);

    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        "🤖 Ethio P2P Bot irratti baga nagaan dhuftan!\n\n"
        + "P2P tajaajila keenya fayyadamuuf app kana fayyadami."
      );
    }

    if (text === "/id") {
      await bot.sendMessage(
        chatId,
        `🆔 Chat ID kee:\n\n${chatId}`
      );
    }

    if (text === "/help") {
      await bot.sendMessage(
        chatId,
        "📚 Commands:\n\n"
        + "/start - Bot jalqabi\n"
        + "/id - Chat ID ilaali\n"
        + "/help - Gargaarsa"
      );
    }
  });

  console.log("✅ Telegram Bot started");
}


/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ethio P2P Bot Server is running 🚀"
  });
});


/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Bot server is healthy ✅"
  });
});


/* =========================
   ADMIN TEST
========================= */

app.post("/api/admin-message", async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }

    if (!BOT_TOKEN) {
      return res.status(500).json({
        success: false,
        error: "BOT_TOKEN is missing"
      });
    }

    if (!ADMIN_CHAT_ID) {
      return res.status(500).json({
        success: false,
        error: "ADMIN_CHAT_ID is missing"
      });
    }

    const bot = new TelegramBot(BOT_TOKEN);

    await bot.sendMessage(
      ADMIN_CHAT_ID,
      message
    );

    res.json({
      success: true,
      message: "Admin message sent successfully ✅"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


/* =========================
   VERIFICATION
========================= */

app.post("/api/verify-account", async (req, res) => {

  try {

    const {
      fullName,
      phoneNumber
    } = req.body;

    if (!fullName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Full name and phone number are required"
      });
    }

    const message =
`🔔 NEW VERIFICATION REQUEST

👤 Name:
${fullName}

📱 Phone:
${phoneNumber}

⏳ Status:
Waiting for admin review.

🆔 Ethio P2P Verification`;

    if (BOT_TOKEN && ADMIN_CHAT_ID) {

      const bot = new TelegramBot(BOT_TOKEN);

      await bot.sendMessage(
        ADMIN_CHAT_ID,
        message
      );

    }

    res.json({
      success: true,
      message: "Verification request sent successfully ✅"
    });

  } catch (error) {

    console.error("Verification error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🚀 Bot Server running on port ${PORT}`
  );

});
