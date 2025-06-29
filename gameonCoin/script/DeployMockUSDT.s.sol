// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/MockUSDT.sol";

contract DeployMockUSDT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy MockUSDT with 1,000,000 USDT (6 decimals)
        MockUSDT mockUSDT = new MockUSDT(1_000_000 * 10 ** 6);

        console.log("Mock USDT deployed at:", address(mockUSDT));

        vm.stopBroadcast();
    }
}
