// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * MOH DISTRIBUTION ROUTER
 * Flags stolen DOTs and redirects distributions to rightful owners
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

    mapping(address => bool) public isPadrone;
    address[] public padrones;

    event TokenFlaggedStolen(
        uint256 indexed tokenId,
        address indexed thiefWallet,
        address indexed rightfulOwner,
        string reason
    );
    event StolenFlagRemoved(uint256 indexed tokenId);
    event RightfulOwnerUpdated(uint256 indexed tokenId, address indexed newOwner);
    event PadroneUpdated(address indexed padrone, bool status);

    modifier onlyPadrones() {
        require(isPadrone[msg.sender] || msg.sender == owner(), "Not a padrone");
        _;
    }

    constructor(
        address[] memory _padrones,
        address initialOwner
    ) Ownable(initialOwner) {
        for (uint256 i = 0; i < _padrones.length; i++) {
            isPadrone[_padrones[i]] = true;
            padrones.push(_padrones[i]);
        }
    }

    /**
     * @notice Flag a token as stolen and set the rightful owner for distribution redirect
     */
    function flagStolen(
        uint256 tokenId,
        address thiefWallet,
        address rightfulOwner,
        string memory reason
    ) external onlyPadrones {
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
    function removeStolenFlag(uint256 tokenId) external onlyPadrones {
        require(stolenRegistry[tokenId].isStolen, "Not flagged");
        delete stolenRegistry[tokenId];
        emit StolenFlagRemoved(tokenId);
    }

    /**
     * @notice Update the rightful owner address (if victim changes wallet)
     */
    function updateRightfulOwner(uint256 tokenId, address newOwner) external onlyPadrones {
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

    function updatePadrone(address padrone, bool status) external onlyPadrones {
        require(padrone != address(0), "Invalid address");
        if (status && !isPadrone[padrone]) {
            isPadrone[padrone] = true;
            padrones.push(padrone);
        } else if (!status && isPadrone[padrone]) {
            isPadrone[padrone] = false;
        }
        emit PadroneUpdated(padrone, status);
    }

    function getPadrones() external view returns (address[] memory) {
        return padrones;
    }
}


/**
 * MOH REPLACEMENT DOTs
 * Mirrors original MOH tier structure and token ID ranges
 * Padrone-only minting for gas fees - no purchase price
 * Specify exact token ID when minting
 */
contract MOH_ReplacementDOTs is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {

    // Same tier ranges as original MOH contract
    uint256 public constant COMMON_START = 1;
    uint256 public constant COMMON_END = 10000;
    uint256 public constant UNCOMMON_START = 10001;
    uint256 public constant UNCOMMON_END = 15000;
    uint256 public constant RARE_START = 15001;
    uint256 public constant RARE_END = 17500;
    uint256 public constant EPIC_START = 17501;
    uint256 public constant EPIC_END = 18500;
    uint256 public constant LEGENDARY_START = 18501;
    uint256 public constant LEGENDARY_END = 19000;
    uint256 public constant ETERNAL_START = 20001;
    uint256 public constant ETERNAL_END = 20020;

    // Track which tokens have been minted
    mapping(uint256 => bool) public tokenMinted;

    // Metadata
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) private _tokenIPFSHashes;

    // Links replacement token to original stolen token (optional, for theft replacements)
    mapping(uint256 => uint256) public replacesOriginal;

    // Reason/notes for each minted token
    mapping(uint256 => string) public mintReason;

    // Link to distribution router
    MOH_DistributionRouter public distributionRouter;

    // Padrone access
    mapping(address => bool) public isPadrone;
    address[] public padrones;

    string private _contractURI;

    event DOTForged(
        address indexed recipient,
        uint256 indexed tokenId,
        string tier,
        string ipfsHash,
        string reason
    );

    event ReplacementForged(
        address indexed recipient,
        uint256 indexed tokenId,
        uint256 indexed originalTokenId,
        string tier,
        string ipfsHash,
        string reason
    );

    event PadroneUpdated(address indexed padrone, bool status);

    modifier onlyPadrones() {
        require(isPadrone[msg.sender] || msg.sender == owner(), "Not a padrone");
        _;
    }

    constructor(
        address _distributionRouter,
        address[] memory _padrones,
        address initialOwner
    ) ERC721("MOH Replacement DOTs", "MOH-R") Ownable(initialOwner) {
        distributionRouter = MOH_DistributionRouter(_distributionRouter);

        for (uint256 i = 0; i < _padrones.length; i++) {
            isPadrone[_padrones[i]] = true;
            padrones.push(_padrones[i]);
        }
    }

    // ========== CORE MINTING ==========

    /**
     * @notice Forge a replacement DOT with a specific token ID to a specific wallet
     * @dev Padrone only - gas fees only, no purchase price
     * @param recipient Wallet to receive the DOT
     * @param tokenId The exact token ID to mint (must be within valid tier range)
     * @param ipfsHash Metadata IPFS hash
     * @param reason Documentation for why this was minted
     */
    function forgeDOT(
        address recipient,
        uint256 tokenId,
        string memory ipfsHash,
        string memory reason
    ) external onlyPadrones {
        require(recipient != address(0), "Invalid recipient");
        require(!tokenMinted[tokenId], "Token already forged");
        require(_isValidTokenId(tokenId), "Invalid token ID - not in any tier range");

        tokenMinted[tokenId] = true;
        _mint(recipient, tokenId);
        _tokenURIs[tokenId] = ipfsHash;
        _tokenIPFSHashes[tokenId] = ipfsHash;
        mintReason[tokenId] = reason;

        emit DOTForged(recipient, tokenId, _getTierName(tokenId), ipfsHash, reason);
    }

    /**
     * @notice Forge a replacement DOT that is linked to a stolen original
     * @dev Same as forgeDOT but also records which original token it replaces
     * @param recipient Wallet to receive the DOT (the theft victim)
     * @param tokenId The exact token ID to mint
     * @param originalTokenId The original stolen token ID this replaces
     * @param ipfsHash Metadata IPFS hash
     * @param reason Documentation
     */
    function forgeReplacementDOT(
        address recipient,
        uint256 tokenId,
        uint256 originalTokenId,
        string memory ipfsHash,
        string memory reason
    ) external onlyPadrones {
        require(recipient != address(0), "Invalid recipient");
        require(!tokenMinted[tokenId], "Token already forged");
        require(_isValidTokenId(tokenId), "Invalid token ID - not in any tier range");

        tokenMinted[tokenId] = true;
        _mint(recipient, tokenId);
        _tokenURIs[tokenId] = ipfsHash;
        _tokenIPFSHashes[tokenId] = ipfsHash;
        replacesOriginal[tokenId] = originalTokenId;
        mintReason[tokenId] = reason;

        emit ReplacementForged(recipient, tokenId, originalTokenId, _getTierName(tokenId), ipfsHash, reason);
    }

    /**
     * @notice Batch forge multiple DOTs in one transaction
     * @dev Useful for minting a full ramp or multiple tiers at once
     */
    function forgeBatch(
        address recipient,
        uint256[] memory tokenIds,
        string[] memory ipfsHashes,
        string memory reason
    ) external onlyPadrones {
        require(recipient != address(0), "Invalid recipient");
        require(tokenIds.length == ipfsHashes.length, "Arrays must match");
        require(tokenIds.length > 0, "Empty array");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(!tokenMinted[tokenIds[i]], "Token already forged");
            require(_isValidTokenId(tokenIds[i]), "Invalid token ID");

            tokenMinted[tokenIds[i]] = true;
            _mint(recipient, tokenIds[i]);
            _tokenURIs[tokenIds[i]] = ipfsHashes[i];
            _tokenIPFSHashes[tokenIds[i]] = ipfsHashes[i];
            mintReason[tokenIds[i]] = reason;

            emit DOTForged(recipient, tokenIds[i], _getTierName(tokenIds[i]), ipfsHashes[i], reason);
        }
    }

    // ========== TIER VALIDATION ==========

    function _isValidTokenId(uint256 tokenId) internal pure returns (bool) {
        return (
            (tokenId >= COMMON_START && tokenId <= COMMON_END) ||
            (tokenId >= UNCOMMON_START && tokenId <= UNCOMMON_END) ||
            (tokenId >= RARE_START && tokenId <= RARE_END) ||
            (tokenId >= EPIC_START && tokenId <= EPIC_END) ||
            (tokenId >= LEGENDARY_START && tokenId <= LEGENDARY_END) ||
            (tokenId >= ETERNAL_START && tokenId <= ETERNAL_END)
        );
    }

    function _getTierName(uint256 tokenId) internal pure returns (string memory) {
        if (tokenId >= COMMON_START && tokenId <= COMMON_END) return "COMMON";
        if (tokenId >= UNCOMMON_START && tokenId <= UNCOMMON_END) return "UNCOMMON";
        if (tokenId >= RARE_START && tokenId <= RARE_END) return "RARE";
        if (tokenId >= EPIC_START && tokenId <= EPIC_END) return "EPIC";
        if (tokenId >= LEGENDARY_START && tokenId <= LEGENDARY_END) return "LEGENDARY";
        if (tokenId >= ETERNAL_START && tokenId <= ETERNAL_END) return "ETERNAL";
        return "UNKNOWN";
    }

    function getTier(uint256 tokenId) external pure returns (string memory) {
        return _getTierName(tokenId);
    }

    // ========== TOKEN METADATA ==========

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token doesn't exist");
        return _tokenURIs[tokenId];
    }

    function getTokenIPFSHash(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token doesn't exist");
        return _tokenIPFSHashes[tokenId];
    }

    // ========== CONTRACT METADATA ==========

    function setContractURI(string memory newContractURI) external onlyPadrones {
        _contractURI = newContractURI;
    }

    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    // ========== ADMIN ==========

    function updatePadrone(address padrone, bool status) external onlyPadrones {
        require(padrone != address(0), "Invalid address");
        if (status && !isPadrone[padrone]) {
            isPadrone[padrone] = true;
            padrones.push(padrone);
        } else if (!status && isPadrone[padrone]) {
            isPadrone[padrone] = false;
        }
        emit PadroneUpdated(padrone, status);
    }

    function getPadrones() external view returns (address[] memory) {
        return padrones;
    }

    function setDistributionRouter(address _router) external onlyPadrones {
        distributionRouter = MOH_DistributionRouter(_router);
    }

    // ========== REQUIRED OVERRIDES ==========

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
