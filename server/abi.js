export const ABI = [
  {
    "type": "function",
    "name": "setQuizPassed",
    "inputs": [
      { "name": "user", "type": "address" },
      { "name": "status", "type": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "mintIfPassedQuiz",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
  // Add more functions if needed
];
