const inquirer = require("inquirer");
const { swap } = require("./swap");
const { send } = require("./send");
const fs = require("fs");

const actions = [
  "SMPL → WCENT",
  "FLIP → WCENT",
  "BULL → WCENT",
  "WCENT → SMPL",
  "WCENT → FLIP",
  "WCENT → BULL",
  "Send token to addresses",
  "Stop transactions"
];

async function main() {
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
    const { amount } = await inquirer.prompt([
      {
        type: "input",
        name: "amount",
        message: `💱 Amount of ${from} to swap:`
      }
    ]);
    await swap(from, to, amount);
  } else if (choice === "Send token to addresses") {
    const { token, amount } = await inquirer.prompt([
      {
        type: "list",
        name: "token",
        message: "🪙 Choose token to send:",
        choices: ["SMPL", "FLIP", "BULL", "WCENT"]
      },
      {
        type: "input",
        name: "amount",
        message: "📦 Amount to send to each address:"
      }
    ]);
    await send(token, amount);
  } else if (choice === "Stop transactions") {
    fs.writeFileSync("stop.flag", "");
    console.log("🛑 stop.flag created");
  }
}

main();
