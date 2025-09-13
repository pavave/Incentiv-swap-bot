async function swap(fromToken, toToken, amount, count = 1) {
  const tokenIn = tokens[fromToken];
  const tokenOut = tokens[toToken];

  const decimals = 18;
  const amountIn = BigInt(amount) * BigInt(10 ** decimals);
  const totalAmount = amountIn * BigInt(count);

  const balance = await tokenIn.balanceOf(wallet.address);
  if (balance < totalAmount) {
    console.log("❌ Insufficient balance");
    return;
  }

  await tokenIn.approve(router.target, totalAmount);
  console.log("✅ Approved total amount");

  const path = [tokenIn.target, tokenOut.target];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  for (let i = 0; i < count; i++) {
    if (fs.existsSync("stop.flag")) {
      console.log("🛑 Stop flag detected. Halting.");
      break;
    }

    try {
      const tx = await router.swapExactTokensForTokens(
        amountIn,
        0,
        path,
        wallet.address,
        deadline
      );
      console.log(`🔁 Swap ${i + 1}/${count} in progress...`);
      await tx.wait();
      console.log(`✅ Swap ${i + 1} complete`);
    } catch (err) {
      console.log(`❌ Swap ${i + 1} failed:`, err.message);
    }
  }
}
