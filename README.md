# Anonymous Chat Bot

An Anonymous Chat Bot for Telegram that allows users to find chat partners without the need for registration. Users can search for partners, switch chats, or stop chatting seamlessly.

## Features

- No registration required
- Search for chat partners
- Switch to a new partner
- Stop the current chat
- Help command for user guidance

## Requirements

- Node.js (>=14.x)
- npm (Node package manager)
- Telegram Bot Token
- MongoDB (for storing chat sessions)

## Environment Variables

Create a `.env` file in the root directory with the following keys:
  - `PORT`: Port the bot will run on (default: `3000`)
  - `BOT_TOKEN`: Your Telegram Bot token from [BotFather](https://core.telegram.org/bots#botfather)


## Installation
1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/telegram-anonymous-chat-bot.git
   cd telegram-anonymous-chat-bot
   
2. **Installing**:

   ```bash
   npm install

4. **Run in local**

   ```bash
   npm run build && npm run start 

3. **Run in local development**

   ```bash
   npm run dev
