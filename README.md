# 🦾 Incentiv Swap Bot

Automated token swap and transfer bot for the Incentiv testnet. Supports SMPL, FLIP, BULL, and WCENT tokens. Designed for server deployment and CLI interaction.

---

## 📁 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pavave/Incentiv-swap-bot.git
cd Incentiv-swap-bot

## 2. Install Dependencies
### Make sure Node.js version 18 or higher is installed:

```bash
node -v
npm -v

### If Node.js is not installed, use nvm to install it:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm install 18

### Then install all required project dependencies:

```bash
npm install

## 3. Configure Environment Variables
Create and edit the .env file:

```bash
nano .env

### If nano is not installed?

```bash
sudo apt install nano

### Paste the following and replace with your actual values:

```bash
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
RPC_URL=https://rpc1.testnet.incentiv.io
SWAP_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
SMPL=0x0165878A594ca255338adfa4d48449f69242Eb8F
FLIP=0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0
BULL=0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
WCENT=0x5FbDB2315678afecb367f032d93F642f64180aa3

### Save and exit the file (Ctrl+O, Enter, Ctrl+X)

## 4. Create Address List
Create a CSV file containing recipient wallet addresses:

```bash
nano addresses.csv

### Example content:
address
0x1234abcd...
0x5678efgh...
...
Save and exit the file (Ctrl+O, Enter, Ctrl+X)

## 5. Launch the Bot Interface
Run the CLI interface:

```bash
node ui.js
