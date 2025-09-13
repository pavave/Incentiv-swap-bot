const fs = require("fs");
const csv = require("csv-parser");
const { tokens } = require("./tokens");
const { ethers } = require("ethers");

async function sendToken(tokenName, amount) {
  const amountParsed = ethers.utils.parseUnits(amount.toString(), 18);
  const balance = await tokens[tokenName].balanceOf(tokens[tokenName].signer.address);

  if (balance.lt(amountParsed)) {
    console.log(`❌ Недостатньо балансу ${tokenName}. Є: ${ethers.utils.formatUnits(balance, 18)}`);
    return;
  }

  fs.createReadStream("addresses.csv")
    .pipe(csv())
    .on("data", async (row) => {
      if (fs.existsSync("stop.flag")) return console.log("🛑 Стоп-файл знайдено. Зупинка.");
      const tx = await tokens[tokenName].transfer(row.address, amountParsed);
      console.log(`📤 Sent ${tokenName} to ${row.address}: ${tx.hash}`);
    })
    .on("end", () => {
      console.log("✅ Всі перекази завершено.");
    });
}

module.exports = { sendToken };
