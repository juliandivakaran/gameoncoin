// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";


contract Sender is OwnerIsCreator{
    IRouterClient private router;
    IERC20 private linkToken;

    /// @notice Initializes the contract with the router and LINK token address.
    /// @param _router The address of the router contract.
    /// @param _link The address of the link contract.
    constructor(address _router, address _link){
        router = IRouterClient(_router);
        linkToken = IERC20(_link);
    }

    /// @notice Sends data to receiver on the destination chain.
    /// @param destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param receiver The address of the recipient on the destination blockchain.
    /// @param text The string text to be sent.
    /// @return messageId The ID of the message that was sent
    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        string calldata text
    ) external onlyOwner returns (bytes32 messageId){
        Client.EVM2AnyMessage  memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode(text),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000})
            ),
            feeToken: address(linkToken)
        });

        uint256 fees = router.getFee(
            destinationChainSelector,
            message
        );
        require(linkToken.balanceOf(address(this)) > fees, " Not enough LINK blance");

        linkToken.approve(address(router), fees);

        messageId = router.ccipSend(destinationChainSelector, message);

        return messageId;
    }

}