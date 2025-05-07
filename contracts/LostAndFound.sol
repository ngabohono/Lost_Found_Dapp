// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LostAndFound is ReentrancyGuard {
    struct User {
        string username;
        string email;
        string phoneNumber;
        bool isRegistered;
    }

    struct Item {
        string title;
        string description;
        string location;
        address reporter;
        bool isLost;
        bool isClaimed;
        uint256 timestamp;
    }

    uint256 public lostItemCount;
    uint256 public foundItemCount;
    address public owner;

    mapping(address => User) public users;
    mapping(uint256 => LostItem) public lostItems;
    mapping(uint256 => FoundItem) public foundItems;
    
    struct LostItem {
        uint256 id;
        address reporter;
        string name;
        string description;
        string location;
        uint256 dateReported;
        bool resolved;
    }

    struct FoundItem {
        uint256 id;
        address finder;
        string name;
        string description;
        string location;
        uint256 dateReported;
        bool claimed;
    }

    event UserRegistered(address userAddress, string username);
    event LostItemReported(uint256 id, address reporter);
    event FoundItemReported(uint256 id, address finder);
    event ItemClaimed(uint256 foundItemId, address claimant);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function registerUser(string memory _username, string memory _email, string memory _phoneNumber) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");
        
        users[msg.sender] = User({
            username: _username,
            email: _email,
            phoneNumber: _phoneNumber,
            isRegistered: true
        });
        
        emit UserRegistered(msg.sender, _username);
    }

    function reportLostItem(
        string memory _name,
        string memory _description,
        string memory _location
    ) external {
        lostItemCount++;
        lostItems[lostItemCount] = LostItem(
            lostItemCount,
            msg.sender,
            _name,
            _description,
            _location,
            block.timestamp,
            false
        );
        emit LostItemReported(lostItemCount, msg.sender);
    }

    function reportFoundItem(
        string memory _name,
        string memory _description,
        string memory _location
    ) external {
        foundItemCount++;
        foundItems[foundItemCount] = FoundItem(
            foundItemCount,
            msg.sender,
            _name,
            _description,
            _location,
            block.timestamp,
            false
        );
        emit FoundItemReported(foundItemCount, msg.sender);
    }

    function claimItem(uint256 _foundItemId) external nonReentrant {
        FoundItem storage item = foundItems[_foundItemId];
        require(!item.claimed, "Already claimed");
        require(item.finder != msg.sender, "Finder cannot claim");
        item.claimed = true;
        emit ItemClaimed(_foundItemId, msg.sender);
    }

    function resolveLostItem(uint256 _lostItemId) external {
        LostItem storage item = lostItems[_lostItemId];
        require(item.reporter == msg.sender, "Not your report");
        require(!item.resolved, "Already resolved");
        item.resolved = true;
    }

    function getItemCount() public view returns (uint256) {
        return lostItemCount + foundItemCount;
    }
}
