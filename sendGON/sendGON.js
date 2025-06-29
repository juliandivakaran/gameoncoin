// sendGON.js
const { Web3 } = require('web3');
require('dotenv').config();
const fs = require('fs');

// ✅ Print environment variable check
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "[hidden]" : "NOT SET");
console.log("GON_CONTRACT:", process.env.GON_CONTRACT);
console.log("SEPOLIA_RPC_URL:", process.env.SEPOLIA_RPC_URL);

// ✅ Minimal ABI for ERC-20 token
const GON_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  }
];

// ✅ File to track sent wallets
const SENT_FILE = 'send_wallets.json';

// ✅ Initialize Web3 and account
const web3 = new Web3(process.env.SEPOLIA_RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// ✅ GON token contract instance
const gon = new web3.eth.Contract(GON_ABI, process.env.GON_CONTRACT);

// ✅ Load previously sent addresses
let sendAddresses = [];
if (fs.existsSync(SENT_FILE)) {
  sendAddresses = JSON.parse(fs.readFileSync(SENT_FILE));
}

// ✅ Replace with form input
const email = "example@gmail.com";
const wallet = "0x86e62D49eD329Af602d0172De2Cc3e56f0cD04dB";

async function sendIfNewWallet(email, wallet) {
  console.log(`🔍 Checking wallet: ${wallet}`);

  if (sendAddresses.includes(wallet.toLowerCase())) {
    console.log(`❌ Wallet ${wallet} already received GON.`);
    return;
  }

  try {
    // ✅ Check balances
    const senderBalance = await gon.methods.balanceOf(account.address).call();
    const receiverBefore = await gon.methods.balanceOf(wallet).call();
    console.log(`📦 Sender GON Balance: ${web3.utils.fromWei(senderBalance, 'ether')} GON`);
    console.log(`📊 Receiver GON Before: ${web3.utils.fromWei(receiverBefore, 'ether')} GON`);

    // ✅ Prepare transfer
    const amountToSend = web3.utils.toWei("100", 'ether'); // 100 GON
    const tx = gon.methods.transfer(wallet, amountToSend);
    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(account.address, 'pending');
    const chainId = await web3.eth.getChainId();

    const txObject = {
      to: process.env.GON_CONTRACT,
      data: tx.encodeABI(),
      gas: web3.utils.toHex(gas),
      gasPrice: web3.utils.toHex(gasPrice),
      value: "0x0",
      nonce: nonce,
      chainId: chainId
    };

    // ✅ Sign and send transaction
    const signedTx = await web3.eth.accounts.signTransaction(txObject, process.env.PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`✅ Sent 100 GON to ${wallet}`);
    console.log(`🔗 Tx Hash: ${receipt.transactionHash}`);

    // ✅ Save wallet address
    sendAddresses.push(wallet.toLowerCase());
    fs.writeFileSync(SENT_FILE, JSON.stringify(sendAddresses, null, 2));

    // ✅ Receiver balance after transfer
    const receiverAfter = await gon.methods.balanceOf(wallet).call();
    console.log(`📊 Receiver GON After: ${web3.utils.fromWei(receiverAfter, 'ether')} GON`);
  } catch (err) {
    console.error("❌ Error sending GON:", err.message);
  }
}

// 🚀 Run
sendIfNewWallet(email, wallet).catch(console.error);
