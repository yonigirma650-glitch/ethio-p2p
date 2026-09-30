import logging
from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import (
    ApplicationBuilder, CommandHandler, MessageHandler, 
    CallbackQueryHandler, ConversationHandler, ContextTypes, filters
)

# 1. Token Bot-ii fi ID Group Admin keetii asitti galchi
BOT_TOKEN =os.getenv(Your token was replaced with a new one. You can use this token to access HTTP API:
8669113896:AAHNejwqpUuhTIiwC0zUZ3I0LD5cAqbKXI0)
ADMIN_GROUP_ID =  8567050757 

NAME, PHONE, FRONT_ID, BACK_ID = range(4)

user_data_store = {}
kyc_status = {}

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    status = kyc_status.get(user_id, 'none')

    if status == 'approved':
        await update.message.reply_text("✅ ማንነትዎ ተረጋግጧል! አሁኑኑ Mini App በመክፈት መጠቀም ይችላሉ።")
        return ConversationHandler.END
    elif status == 'pending':
        await update.message.reply_text("⏳ መታወቂያዎ በመመርመር ላይ ይገኛል። እባክዎን ትንሽ ይታገሱ።")
        return ConversationHandler.END
    else:
        await update.message.reply_text(
            "👋 እንኳን ደህና መጡ! በP2P ለመነጋደድ አስቀድመው ማንነትዎን ማረጋገጥ አለብዎት።\n\n"
            "እባክዎን ሙሉ ስምዎን ያስገቡ፡"
        )
        return NAME

async def get_name(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user_data_store[user_id] = {'full_name': update.message.text}
    
    keyboard = ReplyKeyboardMarkup(
        [[KeyboardButton("📱 የስልክ ቁጥር ላክ", request_contact=True)]], 
        resize_keyboard=True, 
        one_time_keyboard=True
    )
    await update.message.reply_text("አመሰግናለሁ! አሁን ደግሞ ከታች ያለውን ቁልፍ በመጫን የስልክ ቁጥርዎን ይላኩ።", reply_markup=keyboard)
    return PHONE

async def get_phone(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    phone = update.message.contact.phone_number if update.message.contact else update.message.text
    user_data_store[user_id]['phone'] = phone
    await update.message.reply_text("አሁን ደግሞ የብሔራዊ መታወቂያዎን **የፊተኛውን ገጽ (Front Side)** ፎቶ አንስተው ይላኩ።")
    return FRONT_ID

async def get_front_id(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user_data_store[user_id]['front_photo'] = update.message.photo[-1].file_id
    await update.message.reply_text("በጣም ጥሩ! በመጨረሻም የመታወቂያዎን **የኋለኛውን ገጽ (Back Side)** ፎቶ ይላኩ።")
    return BACK_ID

async def get_back_id(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    back_photo = update.message.photo[-1].file_id
    user_data_store[user_id]['back_photo'] = back_photo
    kyc_status[user_id] = 'pending'

    await update.message.reply_text("መረጃዎ በጥሩ ሁኔታ ደርሶናል! አድሚኖቻችን መርምረው እስከሚያጸድቁ ድረስ እባክዎን ትንሽ ይታገሱ።")

    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton("✅ Approve", callback_data=f"app_{user_id}"),
            InlineKeyboardButton("❌ Reject", callback_data=f"rej_{user_id}")
        ]
    ])

    user_info = user_data_store[user_id]
    caption = f"📋 **አዲስ የKYC ማረጋገጫ ጥያቄ**\n\n👤 ስም: {user_info['full_name']}\n📞 ስልክ: {user_info['phone']}\n🆔 ID: {user_id}"

    await context.bot.send_photo(chat_id=ADMIN_GROUP_ID, photo=user_info['front_photo'], caption=f"Front Side ID:\n{caption}")
    await context.bot.send_photo(chat_id=ADMIN_GROUP_ID, photo=back_photo, caption="Back Side ID:", reply_markup=keyboard)
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("ምዝገባው ተቋርጧል።")
    return ConversationHandler.END

async def handle_admin_action(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    action, target_user_id = query.data.split("_")
    target_user_id = int(target_user_id)

    if action == "app":
        kyc_status[target_user_id] = 'approved'
        await query.edit_message_caption(caption=f"{query.message.caption}\n\n✅ **APPROVED (ጽድቋል)**")
        await context.bot.send_message(chat_id=target_user_id, text="🎉 አካውንትዎ ተረጋግጧል! አሁን P2P መጠቀም ይችላሉ።")
    elif action == "rej":
        kyc_status[target_user_id] = 'rejected'
        await query.edit_message_caption(caption=f"{query.message.caption}\n\n❌ **REJECTED (ውድቅ ተደርጓል)**")
        await context.bot.send_message(chat_id=target_user_id, text="❌ ያስገቡት መታወቂያ ውድቅ ተደርጓል። እባክዎን እንደገና በግልጽ አያይዘው ይላኩ።")

if __name__ == '__main__':
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_name)],
            PHONE: [MessageHandler(filters.CONTACT | filters.TEXT, get_phone)],
            FRONT_ID: [MessageHandler(filters.PHOTO, get_front_id)],
            BACK_ID: [MessageHandler(filters.PHOTO, get_back_id)],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
    )

    app.add_handler(conv_handler)
    app.add_handler(CallbackQueryHandler(handle_admin_action, pattern="^(app_|rej_)"))
    app.run_polling()
