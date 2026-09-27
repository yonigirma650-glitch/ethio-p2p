import os
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters

TOKEN = os.getenv(Your token was replaced with a new one. You can use this token to access HTTP API:
8669113896:AAEY_ECBspnXVGCWyGKK3mvoGuyFeRXN7TY)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🇪🇹 Ethio P2P\n\n"
        "Baga nagaan dhuftan!\n"
        "Mee maqaa guutuu keessan galchaa."
    )
    context.user_data["step"] = "name"

async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    step = context.user_data.get("step")

    if step == "name":
        context.user_data["name"] = text
        context.user_data["step"] = "national_id"
        await update.message.reply_text(
            "Mee National ID keessan galchaa."
        )

    elif step == "national_id":
        context.user_data["national_id"] = text
        context.user_data["step"] = "phone"
        await update.message.reply_text(
            "Mee lakkoofsa bilbilaa keessan galchaa."
        )

    elif step == "phone":
        context.user_data["phone"] = text
        context.user_data["step"] = "done"
        await update.message.reply_text(
            "✅ Odeeffannoon keessan fudhatame.\n"
            "Registration itti fufa."
        )

def main():
    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))

    app.run_polling()

if __name__ == "__main__":
    main()
