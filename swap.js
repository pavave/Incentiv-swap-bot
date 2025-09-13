const { ethers } = require("ethers");
const { tokens, wallet } = require("./tokens");
require("dotenv").config();

const swapAbi = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

const swap = new ethers.Contract(process.env.SWAP_ADDRESS, swapAbi, wallet);

async function swapTokens(from, to, amount) {
  const amountIn = ethers.utils.parseUnits(amount.toString(), 18);
  const balance = await tokens[from].balanceOf(wallet.address);

  if (balance.lt(amountIn)) {
    console.log(`❌ Недостатньо балансу ${from}. Є: ${ethers.utils.formatUnits(balance, 18)}`);
    return;
  }

  await tokens[from].approve(swap.address, amountIn);
  const tx = await swap.swapExactTokensForTokens(
    amountIn,
    0,
    [tokens[from].address, tokens[to].address],
    wallet.address,
    Math.floor(Date.now() / 1000) + 600
  );
  console.log(`✅ Swapped ${from} → ${to}: ${tx.hash}`);
}

module.exports = { swapTokens };
