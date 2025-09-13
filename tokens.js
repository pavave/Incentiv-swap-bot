const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const erc20Abi = [
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint amount) returns (bool)"
];

const tokens = {
  SMPL: new ethers.Contract(process.env.SMPL, erc20Abi, wallet),
  FLIP: new ethers.Contract(process.env.FLIP, erc20Abi, wallet),
  BULL: new ethers.Contract(process.env.BULL, erc20Abi, wallet),
  WCENT: new ethers.Contract(process.env.WCENT, erc20Abi, wallet)
};

module.exports = { tokens, wallet, provider };
