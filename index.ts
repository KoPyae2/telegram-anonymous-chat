import express, { Express, Request, Response, Application } from 'express';
import { setupBot } from './src/bot';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 6000;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, async () => {
    console.log(`🔥 Server is running on http://localhost:${port} 🔥`);
    console.log('============================');
    const bot = await setupBot()
    bot.launch()
    console.log('🚀 Telegram is Ready 🚀');
    console.log('============================');
});