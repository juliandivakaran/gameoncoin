import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import gonABI from './abis/gon.json'; // Export GON ABI here
import routerABI from './abis/router.json'; // Export Uniswap Router ABI here

const gonAddress = import.meta.env.VITE_GON_TOKEN_ADDRESS;
const routerAddress = import.meta.env.VITE_ROUTER_ADDRESS;

function App() {
  const [account, setAccount] = useState(null);
  const [gonBalance, setGonBalance] = useState("0");

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const [addr] = await provider.send("eth_requestAccounts", []);
      setAccount(addr);
    }
  };

  const getGonBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gon = new ethers.Contract(gonAddress, gonABI, signer);
    const balance = await gon.balanceOf(account);
    setGonBalance(ethers.utils.formatEther(balance));
  };

  useEffect(() => {
    if (account) getGonBalance();
  }, [account]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🪙 GON Token DApp</h2>
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <p>Your GON Balance: {gonBalance}</p>
        </div>
      )}
    </div>
  );
}

export default App;
