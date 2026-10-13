const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
await ctx.reply(
'🎮 JAHONGIR GAMES\n\n' +
'Xush kelibsiz! Bu yerda sizni fanlarga oid qiziqarli o‘yinlar kutmoqda.\n\n' +
'🚀 O‘yinni boshlash uchun tugmani bosing!',
Markup.inlineKeyboard([
[Markup.button.callback('🎮 O‘yinlar', 'games')],
[Markup.button.callback('👤 Profilim', 'profile')],
[Markup.button.callback('🏆 Reyting', 'rating')]
])
);
});

bot.action('games', async (ctx) => {
await ctx.answerCbQuery();
await ctx.reply(
'🎯 O‘YIN TURINI TANLANG:',
Markup.inlineKeyboard([
[Markup.button.callback('🎯 Quiz Game', 'quiz')],
[Markup.button.callback('🧠 Brain Battle', 'battle')],
[Markup.button.callback('⚡ Super Game Center', 'super')],
[Markup.button.callback('⬅️ Orqaga', 'back')]
])
);
});

bot.action('quiz', async (ctx) => {
await ctx.answerCbQuery();
await ctx.reply('🎯 Quiz Game tez orada ishga tushadi!');
});

bot.action('battle', async (ctx) => {
await ctx.answerCbQuery();
await ctx.reply('🧠 Brain Battle tez orada ishga tushadi!');
});

bot.action('super', async (ctx) => {
await ctx.answerCbQuery();
await ctx.reply('⚡ Super Game Center tez orada ishga tushadi!');
});

bot.action('profile', async (ctx) => {
await ctx.answerCbQuery();
await ctx.reply(`👤 Sizning profilingiz\n🆔 ID: ${ctx.from.id}\n🎮 JAHONGIR GAMES`);
});

bot.action('rating', async (ctx) => {
await ctx.answerCbQuery();
await ctx.reply('🏆 Reyting tizimini keyingi bosqichda yaratamiz!');
});

bot.action('back', async (ctx) => {
await ctx.answerCbQuery();
await ctx.reply(
'🎮 JAHONGIR GAMES — bosh menyu\n\nO‘yinni tanlash uchun /start buyrug‘ini yuboring.'
);
});

bot.catch((err) => {
console.error('Bot xatosi:', err.message);
});

bot.launch()
.then(() => console.log('🎮 JAHONGIR GAMES ishga tushdi!'))
.catch((err) => console.error('Botni ishga tushirib bo‘lmadi:', err.message));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
