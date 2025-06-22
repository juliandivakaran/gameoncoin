import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { ABI } from "./abi.js";

dotenv.config();

const app = express();
app.use(express.json());

// Define a root route
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  "0x9df5426d0DAEb8446338891Ca6AF7Eda55a796D7",
  ABI,
  wallet
);

app.post("/mint", async (req, res) => {
  try {
    const { walletAddress } = req.body;

    // 1. Set quiz status
    const tx1 = await contract.setQuizPassed(walletAddress, true);
    await tx1.wait();

    // 2. Mint 10 GON
    const amount = ethers.parseUnits("10", 18);
    const tx2 = await contract.mintIfPassedQuiz(walletAddress, amount);
    await tx2.wait();

    res.status(200).send("✅ Minted 10 GON successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error minting GON");
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
