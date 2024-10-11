import { Markup, Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

const sessions: { [key: number]: number | null } = {};

const foundMenu = Markup.keyboard([
    ['/next', '/stop'],
]).resize();

const notFoundMenu = Markup.keyboard([
    ['/search','/stop','/help'],
]).resize();

export const setupBot = async () => {
    bot.start((ctx) => {
        ctx.reply('Welcome to the Anonymous Chat Bot! Use /search to find a chat partner.', notFoundMenu);
    });

    bot.command('search', (ctx) => {
        const userId = ctx.from?.id;

        if (!userId) return;

        // If the user is already connected to a partner
        if (sessions[userId] && sessions[userId] !== null) {
            return ctx.reply('You are already in a chat. Use /next to switch partners or /stop to end the chat.', foundMenu);
        }

        // If the user is in the process of searching
        if (sessions[userId] === null) {
            return ctx.reply('You are already searching for a chat partner. Please wait or use /stop to end your search.', notFoundMenu);
        }

        ctx.reply('Searching for a chat partner... Please wait!');

        // Find a match
        const matchedUser = Object.keys(sessions).find(id => sessions[Number(id)] !== userId && sessions[Number(id)] !== null);

        if (matchedUser) {
            // Match found
            sessions[userId] = Number(matchedUser);
            sessions[Number(matchedUser)] = userId;

            ctx.reply('You are now connected with a partner! Type your message below.', foundMenu);
            bot.telegram.sendMessage(Number(matchedUser), 'You are now connected with a partner! Type your message below.', foundMenu);
        } else {
            // No match found
            sessions[userId] = null; // Mark user as searching
            ctx.reply('No partners available at the moment. Please try again later.', notFoundMenu);
        }
    });

    bot.command('next', (ctx) => {
        const userId = ctx.from?.id;

        if (!userId) return;

        if (!sessions[userId]) {
            return ctx.reply('You are not currently in a chat. Use /search to find a partner.', notFoundMenu);
        }

        const currentPartner = sessions[userId];
        delete sessions[currentPartner]; // Disconnect current partner
        delete sessions[userId]; // Disconnect self

        ctx.reply('Searching for a new chat partner... Please wait!');

        // Find a new match
        const newMatchedUser = Object.keys(sessions).find(id => sessions[Number(id)] !== userId && sessions[Number(id)] !== null);

        if (newMatchedUser) {
            // New match found
            sessions[userId] = Number(newMatchedUser);
            sessions[Number(newMatchedUser)] = userId;

            ctx.reply('You are now connected with a new partner! Type your message below.', foundMenu);
            bot.telegram.sendMessage(Number(newMatchedUser), 'You are now connected with a new partner! Type your message below.', foundMenu);
        } else {
            // No new match found
            sessions[userId] = null; // Mark user as searching
            ctx.reply('No partners available at the moment. Please try again later.', notFoundMenu);
        }
    });

    bot.command('stop', (ctx) => {
        const userId = ctx.from?.id;

        if (!userId) return;

        if (!sessions[userId]) {
            return ctx.reply('You are not currently in a chat. Use /search to find a partner.', notFoundMenu);
        }

        const currentPartner = sessions[userId];
        delete sessions[currentPartner]; // Disconnect current partner
        delete sessions[userId]; // Disconnect self

        ctx.reply('You have ended the chat. Thank you for using the service!', notFoundMenu);
        bot.telegram.sendMessage(currentPartner, 'Your chat partner has left the chat.', notFoundMenu);
    });

    bot.command('help', (ctx) => {
        ctx.reply(
            `Here are the commands you can use:
            /search - Start searching for chats
            /next - Go to the next chat
            /stop - Stop the current chat
            /help - Show this help message`
        );
    });

    bot.on('text', (ctx) => {
        const userId = ctx.from?.id;

        if (!userId || !sessions[userId]) {
            return ctx.reply('You are not currently in a chat. Use /search to find a partner.', notFoundMenu);
        }

        const chatPartner = sessions[userId];
        // bot.telegram.sendMessage(chatPartner, `${ctx.from.first_name}: ${ctx.message.text}`);
        bot.telegram.sendMessage(chatPartner, ctx.message.text);
    });

    return bot;
};

