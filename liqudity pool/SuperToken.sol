// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "../gameonCoin/lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

Contract SuperToken is ERC20 {
    constructor() ERC20 ("GameOn Token", "GON"){
        _mint(msg.sender, 100 ether); // Mints 100 tokens (with 18 decimals)
    }
}
