const readline = require("readline");
const { swapTokens } = require("./swap");
const { sendToken } = require("./send");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🔧 Вибери дію:");
console.log("1. SMPL → WCENT");
console.log("2. FLIP → WCENT");
console.log("3. BULL → WCENT");
console.log("4. WCENT → SMPL");
console.log("5. WCENT → FLIP");
console.log("6. WCENT → BULL");
console.log("7. Надіслати токен");
console.log("8. Стоп транзакції");

rl.question("👉 Введи номер дії: ", async (choice) => {
  const swapMap = {
    "1": ["SMPL", "WCENT"],
    "2": ["FLIP", "WCENT"],
    "3": ["BULL", "WCENT"],
    "4": ["WCENT", "SMPL"],
    "5": ["WCENT", "FLIP"],
    "6": ["WCENT", "BULL"]
  };

  if (["1", "2", "3", "4", "5", "6"].includes(choice)) {
    rl.question("💰 Введи суму для свапу: ", async (amount) => {
      const [from, to] = swapMap[choice];
      await swapTokens(from, to, amount);
      rl.close();
    });
  } else if (choice === "7") {
    rl.question("🔤 Токен (SMPL, FLIP, BULL, WCENT): ", (token) => {
      rl.question("💰 Сума: ", async (amount) => {
        await sendToken(token, amount);
        rl.close();
      });
    });
  } else if (choice === "8") {
    require("fs").writeFileSync("stop.flag", "STOP");
    console.log("🛑 Стоп-файл створено.");
    rl.close();
  } else {
    console.log("❌ Невірний вибір.");
    rl.close();
  }
});
