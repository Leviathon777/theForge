// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract RevShareDistribution is Ownable, ReentrancyGuard {
    uint256 public distributionPercentage = 20; 
    address public mohContract; 
    uint256 public totalFundsDistributed; 

    event FundsDistributed(uint256 totalDistributed);
    event investorPaid(address indexed investor, uint256 amount);
    event DistributionPercentageUpdated(uint256 oldPercentage, uint256 newPercentage);
    event MOHContractUpdated(address indexed oldContract, address indexed newContract);
    event FundsDeposited(address indexed depositor, uint256 amount);

    constructor(address initialOwner, address _mohContract) Ownable(initialOwner) {
        require(initialOwner != address(0), "Invalid owner address");
        require(_mohContract != address(0), "Invalid MOH contract address");
        mohContract = _mohContract;
    }

    /* Update the MOH Contract Address */
    function updateMOHContract(address _newMOHContract) external onlyOwner {
        require(_newMOHContract != address(0), "Invalid MOH contract address");
        emit MOHContractUpdated(mohContract, _newMOHContract);
        mohContract = _newMOHContract;
    }

    /* Update the Distribution Percentage */
    function updateDistributionPercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage > 0 && _newPercentage <= 100, "Invalid percentage");
        emit DistributionPercentageUpdated(distributionPercentage, _newPercentage);
        distributionPercentage = _newPercentage;
    }

    /* Deposit Funds to the Contract */
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    /* Distribute Revenue */
    function distributeRevenue() external nonReentrant {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds to distribute");

        uint256 distributeAmount = (contractBalance * distributionPercentage) / 100;
        IERC721Enumerable dotContract = IERC721Enumerable(mohContract);

        uint256 totalSupply = dotContract.totalSupply();
        require(totalSupply > 0, "No MOH tokens exist");

        // Use an array to store investor addresses
        address[] memory investorAddresses = new address[](totalSupply);
        uint256[] memory investorWeights = new uint256[](totalSupply);

        uint256 totalWeight = 0;
        uint256 investorIndex = 0;

        for (uint256 i = 0; i < totalSupply; i++) {
            uint256 tokenId = dotContract.tokenByIndex(i);
            address investor = dotContract.ownerOf(tokenId);
            uint256 weight = calculateTokenWeight(tokenId);

            // Check if investor already exists in the list
            bool exists = false;
            for (uint256 j = 0; j < investorIndex; j++) {
                if (investorAddresses[j] == investor) {
                    investorWeights[j] += weight;
                    exists = true;
                    break;
                }
            }

            // Add new investor if not already in the list
            if (!exists) {
                investorAddresses[investorIndex] = investor;
                investorWeights[investorIndex] = weight;
                investorIndex++;
            }

            totalWeight += weight;
        }

        require(totalWeight > 0, "No valid investors with weights");

        // Distribute funds proportionally
        for (uint256 i = 0; i < investorIndex; i++) {
            uint256 share = (distributeAmount * investorWeights[i]) / totalWeight;
            (bool success, ) = payable(investorAddresses[i]).call{value: share}("");
            require(success, "Transfer failed");
            emit investorPaid(investorAddresses[i], share);
        }

        totalFundsDistributed += distributeAmount;
        emit FundsDistributed(distributeAmount);
    }

    /* Calculate Token Weight Based on Tiers */
    function calculateTokenWeight(uint256 tokenId) public pure returns (uint256) {
        if (tokenId < 10000) return 1; // COMMON
        if (tokenId < 15000) return 2; // UNCOMMON
        if (tokenId < 17500) return 3; // RARE
        if (tokenId < 18500) return 4; // EPIC
        if (tokenId < 20000) return 5; // LEGENDARY
        return 0; // Eternal not included
    }
}
