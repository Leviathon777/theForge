// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * MOH DISTRIBUTION ROUTER
 * Flags stolen DOTs and redirects distributions to rightful owners
 * Owner-only - deploy with your wallet address
 */
contract MOH_DistributionRouter is Ownable, ReentrancyGuard {

    struct StolenRecord {
        bool isStolen;
        address thiefWallet;
        address rightfulOwner;
        uint256 timestamp;
        string reason;
    }

    // tokenId => StolenRecord
    mapping(uint256 => StolenRecord) public stolenRegistry;
    uint256[] public stolenTokenIds;

    event TokenFlaggedStolen(
        uint256 indexed tokenId,
        address indexed thiefWallet,
        address indexed rightfulOwner,
        string reason
    );
    event StolenFlagRemoved(uint256 indexed tokenId);
    event RightfulOwnerUpdated(uint256 indexed tokenId, address indexed newOwner);

    constructor(
        address initialOwner
    ) Ownable(initialOwner) {}

    /**
     * @notice Flag a token as stolen and set the rightful owner for distribution redirect
     */
    function flagStolen(
        uint256 tokenId,
        address thiefWallet,
        address rightfulOwner,
        string memory reason
    ) external onlyOwner {
        require(rightfulOwner != address(0), "Invalid rightful owner");
        require(!stolenRegistry[tokenId].isStolen, "Already flagged");

        stolenRegistry[tokenId] = StolenRecord({
            isStolen: true,
            thiefWallet: thiefWallet,
            rightfulOwner: rightfulOwner,
            timestamp: block.timestamp,
            reason: reason
        });

        stolenTokenIds.push(tokenId);
        emit TokenFlaggedStolen(tokenId, thiefWallet, rightfulOwner, reason);
    }

    /**
     * @notice Remove stolen flag (if resolved)
     */
    function removeStolenFlag(uint256 tokenId) external onlyOwner {
        require(stolenRegistry[tokenId].isStolen, "Not flagged");
        delete stolenRegistry[tokenId];
        emit StolenFlagRemoved(tokenId);
    }

    /**
     * @notice Update the rightful owner address (if victim changes wallet)
     */
    function updateRightfulOwner(uint256 tokenId, address newOwner) external onlyOwner {
        require(stolenRegistry[tokenId].isStolen, "Not flagged");
        require(newOwner != address(0), "Invalid address");
        stolenRegistry[tokenId].rightfulOwner = newOwner;
        emit RightfulOwnerUpdated(tokenId, newOwner);
    }

    /**
     * @notice Check if a token is stolen
     */
    function isTokenStolen(uint256 tokenId) external view returns (bool) {
        return stolenRegistry[tokenId].isStolen;
    }

    /**
     * @notice Get the rightful owner for a stolen token
     */
    function getRightfulOwner(uint256 tokenId) external view returns (address) {
        if (stolenRegistry[tokenId].isStolen) {
            return stolenRegistry[tokenId].rightfulOwner;
        }
        return address(0);
    }

    /**
     * @notice Get full stolen record
     */
    function getStolenRecord(uint256 tokenId) external view returns (StolenRecord memory) {
        return stolenRegistry[tokenId];
    }

    /**
     * @notice Get all stolen token IDs
     */
    function getAllStolenTokenIds() external view returns (uint256[] memory) {
        return stolenTokenIds;
    }

    /**
     * @notice Get count of stolen tokens
     */
    function getStolenCount() external view returns (uint256) {
        return stolenTokenIds.length;
    }
}
