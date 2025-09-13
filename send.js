const fs = require("fs");
const csv = require("csv-parser");
const { tokens, wallet } = require("./tokens");

async function send(tokenName, amount) {
  const token = tokens[tokenName];
  const decimals = 18;
  const amountToSend = BigInt(amount) * BigInt(10 ** decimals);

  const addresses = [];

  fs.createReadStream("addresses.csv")
    .pipe(csv())
    .on("data", (row) => {
      if (row.address) addresses.push(row.address.trim());
    })
    .on("end", async () => {
      console.log(`📤 Sending ${tokenName} to ${addresses.length} addresses`);

      for (const address of addresses) {
        if (fs.existsSync("stop.flag")) {
          console.log("🛑 Stop flag detected. Halting.");
          break;
        }

        try {
          const tx = await token.transfer(address, amountToSend);
          console.log(`✅ Sent to ${address}`);
          await tx.wait();
        } catch (err) {
          console.log(`❌ Error sending to ${address}:`, err.message);
        }
      }

      console.log("🎯 Done");
    });
}

module.exports = { send };
