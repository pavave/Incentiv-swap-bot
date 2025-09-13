const { JsonRpcProvider, Contract, Wallet } = require("ethers");
const axios = require("axios");
require("dotenv").config();

// === CONFIG ===
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PROXY_ADDRESS = process.env.PROXY_ADDRESS; // адреса проксі

const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);

// === STEP 1: Get implementation address from EIP-1967 slot ===
async function getImplementationAddress() {
  const slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  const raw = await provider.getStorage(PROXY_ADDRESS, slot);
  const address = "0x" + raw.slice(-40);
  console.log("🧠 Implementation address:", address);
  return address;
}

// === STEP 2: Try to fetch ABI from Blockscout (Incentiv Explorer) ===
async function fetchAbi(address) {
  const url = `https://explorer-testnet.incentiv.io/api?module=contract&action=getabi&address=${address}`;
  const res = await axios.get(url);
  if (res.data.status === "1") {
    console.log("📦 ABI found");
    return JSON.parse(res.data.result);
  } else {
    console.log("❌ ABI not found or contract not verified");
    return null;
  }
}

// === STEP 3: Create contract instance and list methods ===
async function resolveProxy() {
  const implementation = await getImplementationAddress();
  const abi = await fetchAbi(implementation);

  if (!abi) {
    console.log("⚠️ Cannot proceed without ABI");
    return;
  }

  const contract = new Contract(PROXY_ADDRESS, abi, wallet);
  console.log("🔗 Contract ready");

  // List available methods
  const methods = abi
    .filter((item) => item.type === "function")
    .map((fn) => `${fn.name}(${fn.inputs.map((i) => i.type).join(", ")})`);

  console.log("🧪 Available methods:");
  methods.forEach((m) => console.log("  •", m));
}

resolveProxy();
