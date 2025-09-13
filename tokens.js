const { JsonRpcProvider, Wallet, Contract } = require("ethers");
require("dotenv").config();

const provider = new JsonRpcProvider(process.env.RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

const erc20Abi = [
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint amount) returns (bool)"
];

const tokens = {
  SMPL: new Contract(process.env.SMPL, erc20Abi, wallet),
  FLIP: new Contract(process.env.FLIP, erc20Abi, wallet),
  BULL: new Contract(process.env.BULL, erc20Abi, wallet),
  WCENT: new Contract(process.env.WCENT, erc20Abi, wallet)
};

module.exports = { tokens, wallet, provider };
