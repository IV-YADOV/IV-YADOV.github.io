import asyncio
import logging
import json
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from aiogram.enums import ParseMode

# --- НАСТРОЙКИ ---
TOKEN = "8255270881:AAEg_suzyCdBO3cXYMCX0ISN9W0xDJ84wCk"  # Вставь токен
ADMIN_ID = 2046531123               # Вставь СВОЙ цифровой ID (числом)
WEBAPP_URL = "https://iv-yadov.github.io/"  # Вставь ссылку с GitHub Pages

# Включаем логирование, чтобы видеть ошибки
logging.basicConfig(level=logging.INFO)

bot = Bot(token=TOKEN)
dp = Dispatcher()

# --- КЛАВИАТУРА ---
def get_main_keyboard():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📱 Открыть Регистрацию FEML", web_app=WebAppInfo(url=WEBAPP_URL))]
        ],
        resize_keyboard=True
    )

# --- ХЭНДЛЕР: КОМАНДА /START ---
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "👋 **Добро пожаловать в FEML Season 3!**\n\n"
        "Мы используем профессиональную систему регистрации.\n"
        "Нажми кнопку ниже, чтобы открыть приложение турнира, изучить регламент и подать заявку.",
        reply_markup=get_main_keyboard(),
        parse_mode=ParseMode.MARKDOWN
    )

# --- ХЭНДЛЕР: ПРИЕМ ДАННЫХ ИЗ WEB APP ---
@dp.message(F.web_app_data)
async def process_web_app_data(message: types.Message):
    # Получаем сырые данные (JSON строку)
    raw_data = message.web_app_data.data
    
    try:
        # Превращаем JSON в словарь Python
        data = json.loads(raw_data)
        
        if data.get('action') == 'registration':
            # Формируем красивый отчет для Админа
            text = (
                f"🔥 **НОВАЯ ЗАЯВКА (FEML S3)**\n"
                f"➖➖➖➖➖➖➖➖➖➖\n"
                f"🛡 **Команда:** {data['team']}\n"
                f"👤 **Капитан:** `{data['contact']}`\n\n"
                
                f"📸 **Логотип:** [Ссылка]({data['logo']})\n"
                f"✅ **Медиа-согласие:** ПОДПИСАНО\n\n"
                
                f"📋 **СОСТАВ:**\n"
                f"```\n{data['roster']}\n```"
            )

            # 1. Отправляем отчет АДМИНУ
            await bot.send_message(
                ADMIN_ID, 
                text, 
                parse_mode=ParseMode.MARKDOWN,
                disable_web_page_preview=False
            )

            # 2. Отправляем подтверждение ПОЛЬЗОВАТЕЛЮ
            await message.answer(
                f"✅ **Заявка принята!**\n\n"
                f"Команда: {data['team']}\n"
                f"Мы проверим данные и свяжемся с капитаном ({data['contact']}) для подтверждения слота.\n\n"
                f"Удачи в сезоне!",
                parse_mode=ParseMode.MARKDOWN,
                reply_markup=types.ReplyKeyboardRemove() # Убираем кнопку после регистрации
            )
            
    except Exception as e:
        logging.error(f"Ошибка при обработке данных: {e}")
        await message.answer("⚠️ Произошла ошибка при чтении заявки. Попробуйте еще раз.")

# --- ЗАПУСК ---
async def main():
    print("Бот запущен...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())