WCENT=0x5FbDB2315678afecb367f032d93F642f64180aa3
SMPL=0x0165878A594ca255338adfa4d48449f69242Eb8F
FLIP=0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0
BULL=0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
SWAP_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

const inquirer = require("inquirer");
const fs = require("fs");
const { swap } = require("./swap");
const { send } = require("./send");
const { wallet, tokens } = require("./tokens");

const actions = [
  "TCENT → SMPL",
  "TCENT → BULL",
  "SMPL → TCENT",
  "FUP → TCENT",
  "BULL → TCENT",
  "Send token to addresses",
  "Show wallet balances",
  "Exit"
];

function log(message) {
  fs.appendFileSync("tx.log", `[${new Date().toISOString()}] ${message}\n`);
}

async function showBalances() {
  console.clear();
  console.log("╭────────────────────────────╮");
  console.log("│               Logs         │");
  console.log("╰────────────────────────────╯");
  if (fs.existsSync("tx.log")) {
    const lines = fs.readFileSync("tx.log", "utf8").split("\n").slice(-5);
    lines.forEach(line => console.log("📝 " + line));
  } else {
    console.log("📝 (пусто)");
  }

  console.log("\n╭────────────────────────────╮");
  console.log("│       Wallet balans        │");
  console.log("╰────────────────────────────╯");
  console.log(`👛 ${wallet.address}`);
  for (const [name, token] of Object.entries(tokens)) {
    const balance = await token.balanceOf(wallet.address);
    const formatted = Number(balance) / 1e18;
    console.log(`🔹 ${name}: ${formatted}`);
  }

  console.log("\n╭────────────────────────────╮");
  console.log("│         Actions            │");
  console.log("╰────────────────────────────╯");
}

async function main() {
  while (true) {
    await showBalances();

    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "🔧 Choose an action:",
        choices: actions
      }
    ]);

    if (choice.includes("→")) {
      const [from, to] = choice.split(" → ");
      const { amount, count } = await inquirer.prompt([
        {
          type: "input",
          name: "amount",
          message: `💱 Amount of ${from} to swap (per swap):`
        },
        {
          type: "input",
          name: "count",
          message: "🔁 How many swaps to perform:"
        }
      ]);
      await swap(from, to, amount, count);
      log(`Swapped ${amount} ${from} → ${to} ×${count}`);
    } else if (choice === "Send token to addresses") {
      const { token, amount } = await inquirer.prompt([
        {
          type: "list",
          name: "token",
          message: "🪙 Choose token to send:",
          choices: Object.keys(tokens)
        },
        {
          type: "input",
          name: "amount",
          message: "📦 Amount to send to each address:"
        }
      ]);
      await send(token, amount);
      log(`Sent ${amount} ${token} to CSV addresses`);
    } else if (choice === "Show wallet balances") {
      await showBalances();
    } else if (choice === "Exit") {
      console.log("👋 До зустрічі, Kalitva!");
      break;
    }
  }
}

main();
