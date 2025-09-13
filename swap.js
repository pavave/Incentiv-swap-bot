const { Contract } = require("ethers");
const { tokens, wallet, provider } = require("./tokens");
require("dotenv").config();

const routerAbi = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory)"
];

const router = new Contract(process.env.SWAP_ADDRESS, routerAbi, wallet);

async function swap(fromToken, toToken, amount) {
  const tokenIn = tokens[fromToken];
  const tokenOut = tokens[toToken];

  const decimals = 18;
  const amountIn = BigInt(amount) * BigInt(10 ** decimals);

  const balance = await tokenIn.balanceOf(wallet.address);
  if (balance < amountIn) {
    console.log("❌ Insufficient balance");
    return;
  }

  await tokenIn.approve(router.target, amountIn);
  console.log("✅ Approved");

  const path = [tokenIn.target, tokenOut.target];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const tx = await router.swapExactTokensForTokens(
    amountIn,
    0,
    path,
    wallet.address,
    deadline
  );

  console.log("🔁 Swapping...");
  await tx.wait();
  console.log("✅ Swap complete");
}

module.exports = { swap };
