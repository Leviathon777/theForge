// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract RevShareDistribution is Ownable, ReentrancyGuard, Pausable {
    uint256 public distributionPercentage = 20;
    address public mohContract;
    uint256 public totalFundsDistributed;
    uint256 constant SCALE_FACTOR = 1e18;

    // Mapping to track total paid per investor.
    mapping(address => uint256) public totalPaid;
    // Mapping for XdRiP bonus weights for each investor (set off-chain/UI).
    mapping(address => uint256) public xdripWeights;

    // --- New storage for final weights (UI-supplied) ---
    // finalWeights are computed off-chain by the UI (base weight + bonus)
    mapping(address => uint256) public finalWeights;
    // finalHolders holds addresses for which a final weight has been set.
    address[] public finalHolders;

    // Struct to store distribution records.
    struct DistributionRecord {
        uint256 amount;
        uint256 timestamp;
    }
    DistributionRecord[] public distributions;

    // Events.
    event FundsDistributed(uint256 totalDistributed, uint256 timestamp);
    event InvestorPaid(address indexed investor, uint256 amount);
    event InvestorDistribution(
        address indexed investor,
        uint256 baseWeight,
        uint256 bonus,
        uint256 finalWeight,
        uint256 shareSent
    );
    event DistributionPercentageUpdated(uint256 oldPercentage, uint256 newPercentage);
    event MOHContractUpdated(address indexed oldContract, address indexed newContract);
    event FundsDeposited(address indexed depositor, uint256 amount);
    event FinalWeightsUpdated(address[] investors, uint256[] weights);
    

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

    /**
     * Update XdRiP bonus weights.
     * The UI should send the bonus weight (for example, 15 for a 15% bonus)
     * and we multiply it by SCALE_FACTOR before storing.
     */
    function updateXdRiPWeights(address[] calldata investors, uint256[] calldata weights) external onlyOwner {
        require(investors.length == weights.length, "Mismatched input lengths");
        for (uint256 i = 0; i < investors.length; i++) {
            xdripWeights[investors[i]] = weights[i] * SCALE_FACTOR;
        }
    }

    /**
     * updateFinalWeights:
     * This function allows the UI to supply the final weight (base weight plus bonus)
     * for each holder. This value is then used for revenue distribution.
     *
     * The UI must call this function before calling distributeRevenue().
     */
    function updateFinalWeights(address[] calldata investors, uint256[] calldata weights) external onlyOwner {
        require(investors.length == weights.length, "Mismatched input lengths");
        // Clear existing final holders.
        delete finalHolders;
        for (uint256 i = 0; i < investors.length; i++) {
            finalWeights[investors[i]] = weights[i];
            finalHolders.push(investors[i]);
        }
        emit FinalWeightsUpdated(investors, weights);
    }

    /**
     * distributeRevenue:
     * If final weights have been updated via updateFinalWeights(), use those values.
     * Otherwise, fall back to legacy on-chain calculations using medal weights
     * and adding the bonus from xdripWeights only once per holder.
     */
    function distributeRevenue() external nonReentrant whenNotPaused {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds to distribute");
        uint256 amountToDistribute = (contractBalance * distributionPercentage) / 100;

        // If UI provided final weights, use them.
        if (finalHolders.length > 0) {
            uint256 totalWeight = 0;
            for (uint256 i = 0; i < finalHolders.length; i++) {
                totalWeight += finalWeights[finalHolders[i]];
            }
            require(totalWeight > 0, "No valid final weights");
            distributions.push(DistributionRecord({
                amount: amountToDistribute,
                timestamp: block.timestamp
            }));
            emit FundsDistributed(amountToDistribute, block.timestamp);
            for (uint256 i = 0; i < finalHolders.length; i++) {
                uint256 payoutShare = (amountToDistribute * finalWeights[finalHolders[i]]) / totalWeight;
                if (payoutShare > 0) {
                    (bool sent, ) = payable(finalHolders[i]).call{value: payoutShare}("");
                    require(sent, "Transfer failed");
                    totalPaid[finalHolders[i]] += payoutShare;
                    // Here we emit events—the UI-calculated final weight is used.
                    emit InvestorPaid(finalHolders[i], payoutShare);
                    emit InvestorDistribution(finalHolders[i], 0, 0, finalWeights[finalHolders[i]], payoutShare);
                }
            }
        } else {
            // Fallback: recalc on-chain from medals and bonus from xdripWeights.
            IERC721Enumerable medalContract = IERC721Enumerable(mohContract);
            uint256 totalMedals = medalContract.totalSupply();
            require(totalMedals > 0, "No MOH tokens exist");

            // Create arrays to store unique holders and their medal weights.
            address[] memory uniqueHolders = new address[](totalMedals);
            uint256[] memory holderWeights = new uint256[](totalMedals);
            uint256 uniqueCount = 0;

            // Loop through tokens to sum medal weights per holder WITHOUT the bonus.
            for (uint256 i = 0; i < totalMedals; i++) {
                uint256 medalId = medalContract.tokenByIndex(i);
                address holder = medalContract.ownerOf(medalId);
                uint256 medalWeight = calculateMedalWeight(medalId);
                bool found = false;
                uint256 index = 0;
                for (uint256 j = 0; j < uniqueCount; j++) {
                    if (uniqueHolders[j] == holder) {
                        index = j;
                        found = true;
                        break;
                    }
                }
                if (found) {
                    holderWeights[index] += medalWeight;
                } else {
                    uniqueHolders[uniqueCount] = holder;
                    holderWeights[uniqueCount] = medalWeight;
                    uniqueCount++;
                }
            }

            // Now, add the bonus weight (from XdRiP) only once per unique holder.
            for (uint256 i = 0; i < uniqueCount; i++) {
                // bonus weight is stored as xdripWeights[holder] scaled by SCALE_FACTOR.
                // Divide by SCALE_FACTOR to get the actual bonus.
                uint256 bonusWeight = xdripWeights[uniqueHolders[i]] / SCALE_FACTOR;
                holderWeights[i] += bonusWeight;
            }

            // Calculate total combined weight (medal weight + bonus weight).
            uint256 totalWeight = 0;
            for (uint256 i = 0; i < uniqueCount; i++) {
                totalWeight += holderWeights[i];
            }
            require(totalWeight > 0, "No valid holders with weights");
            
            distributions.push(DistributionRecord({
                amount: amountToDistribute,
                timestamp: block.timestamp
            }));
            emit FundsDistributed(amountToDistribute, block.timestamp);

            for (uint256 i = 0; i < uniqueCount; i++) {
                uint256 payoutShare = (amountToDistribute * holderWeights[i]) / totalWeight;
                if (payoutShare > 0) {
                    (bool sent, ) = payable(uniqueHolders[i]).call{value: payoutShare}("");
                    require(sent, "Transfer failed");
                    totalPaid[uniqueHolders[i]] += payoutShare;
                    // For event purposes, calculate bonus and base weights.
                    uint256 bonus = xdripWeights[uniqueHolders[i]] / SCALE_FACTOR;
                    uint256 baseWeight = holderWeights[i] > bonus ? holderWeights[i] - bonus : 0;
                    emit InvestorPaid(uniqueHolders[i], payoutShare);
                    emit InvestorDistribution(uniqueHolders[i], baseWeight, bonus, holderWeights[i], payoutShare);
                }
            }
        }
        totalFundsDistributed += amountToDistribute;
    }

    /**
     * Calculates the medal weight based on tokenId.
     */
    function calculateMedalWeight(uint256 tokenId) public pure returns (uint256) {
        uint256 RARITY_SET_SIZE = 20000;
        uint256 rampNumber = tokenId / RARITY_SET_SIZE;
        uint256 adjustedTokenId = tokenId % RARITY_SET_SIZE;
        uint256 medalWeight = 0;
        if (adjustedTokenId < 10000) {
            medalWeight = 10;
        } else if (adjustedTokenId < 15000) {
            medalWeight = 25;
        } else if (adjustedTokenId < 17500) {
            medalWeight = 45;
        } else if (adjustedTokenId < 18500) {
            medalWeight = 70;
        } else if (adjustedTokenId < 20000) {
            medalWeight = 110;
        }
        if (rampNumber > 0) {
            medalWeight += 110 * rampNumber;
        }
        return medalWeight;
    }
    
    /* Pause and Unpause */
    function pause() external onlyOwner {
        _pause();
        emit Paused(msg.sender);
    }
    
    function unpause() external onlyOwner {
        _unpause();
        emit Unpaused(msg.sender);
    }
    
    /* Debug view functions */
    function getDistributionCount() external view returns (uint256) {
        return distributions.length;
    }
    
    function getDistribution(uint256 index) external view returns (uint256 amount, uint256 timestamp) {
        require(index < distributions.length, "Index out of bounds");
        DistributionRecord memory record = distributions[index];
        return (record.amount, record.timestamp);
    }

    function getDistributions() external view returns (DistributionRecord[] memory) {
    return distributions;
}

}
