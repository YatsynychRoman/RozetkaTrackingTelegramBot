require('dotenv').config()
const schedule = require('node-schedule')
const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
const urls = ['266141891', '223596301', '270104251', '261758716', '279646908', '269114036', '223588825']

const chatId = process.env.CHAT_ID

const romanId = process.env.ROMAN
const danyloId = process.env.DANYLO

bot.sendMessage(chatId, 'TRACKING ENABLED I WILL TRACK TILL I DIE')
schedule.scheduleJob('*/1 * * * *', async () => {
    try {
        console.log('START')
        const available = (await Promise.all(urls.map(async id => {
            const response = await axios.get(`https://common-api.rozetka.com.ua/v2/goods/get-price/?id=${id}`)
            if (response.data.sell_status === 'available' || response.data.sell_status === 'limited') {
                return id
            }
        })) || []).filter(a => a)
        const validUrls = available.map(element => `https://hard.rozetka.com.ua/ua/${element}/p${element}`)
        if (validUrls.length) {
            await bot.sendMessage(chatId, `[ROMAN](tg://user?id=${romanId}), [DANYLO](tg://user?id=${danyloId}) WOULD YOU LIKE A CRACKERRRRRR???`, {parse_mode: 'Markdown'})
            validUrls.map(url => bot.sendMessage(chatId, url))
        }
    } catch (e) {
        await bot.sendMessage(chatId, `Oops, there was an error..., ${e.message}`)
        console.log(e)
    }
})
