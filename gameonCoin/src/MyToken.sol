// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;


//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title gameon
 * @dev ERC-20 token with minting capabilities and supply cap
 */
contract MyToken is ERC20, Ownable {
    // Maximum number of tokens that can ever exist
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    mapping(address => bool) public isQuizPassed;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        // Mint initial supply to the contract deployer
        _mint(initialOwner, initialSupply);
    }
    
    /**
     * @dev Mint new tokens (only contract owner can call this)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Minting would exceed max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    
    event QuizStatusSet(address indexed user, bool status);
    event QuizMint(address indexed to, uint256 amount);

    function setQuizPassed(address user, bool status) public onlyOwner{
        isQuizPassed[user] = status;
        emit QuizStatusSet(user, status);
    }

    function mintIfPassedQuiz(address to, uint256 amount) public onlyOwner{
        require(isQuizPassed[to], "User has not passed the quiz");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit QuizMint(to, amount);
    }

}