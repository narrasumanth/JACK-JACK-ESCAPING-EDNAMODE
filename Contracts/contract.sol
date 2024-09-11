
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameBasic {
    IERC20 public rewardToken;
    address public owner;

    struct BurnInfo {
        address user;
        uint256 amount;
    }

    struct BurnRecord {
        uint256 timestamp;
        uint256 amount;
    }

    mapping(address => BurnRecord[]) public burnHistory; // Mapping to store burn history per user
    mapping(address => uint256) public lastBurnAmount; // Track each user's last burn amount
    mapping(address => uint256) public highestBurnAmount; // Track highest burn amount per address
    mapping(address => uint256) public totalBurnPerAddress; // Track total burn amount per address
    uint256 public totalAmountBurned; // Track the total amount burned across all users

    BurnInfo[5] public topBurners; // Array to store top 5 burners

    // Static list of users for demonstration purposes
    address[] public users;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(IERC20 _rewardToken) {
        owner = msg.sender;
        rewardToken = _rewardToken;
    }

    // Function for users to burn tokens
    function burn(uint256 amount) external {
        require(amount > 0, "Burn amount must be greater than 0");

        // Update user's last burn amount and total burn amount for the user
        lastBurnAmount[msg.sender] = amount;
        totalBurnPerAddress[msg.sender] += amount;
        totalAmountBurned += amount;

        // Burn tokens
        rewardToken.burn(amount);

        // Store burn history
        burnHistory[msg.sender].push(BurnRecord(block.timestamp, amount));

        // Update highest burn amount
        if (amount > highestBurnAmount[msg.sender]) {
            highestBurnAmount[msg.sender] = amount;
        }

        // Update the top 5 burners
        _updateTopBurners(msg.sender);
        
        // Add the user to the list if not already present
        if (!_isUserPresent(msg.sender)) {
            users.push(msg.sender);
        }
    }

    // Function to check if a user is in the list
    function _isUserPresent(address user) internal view returns (bool) {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == user) {
                return true;
            }
        }
        return false;
    }

    // Function to update top 5 burners
    function _updateTopBurners(address user) internal {
        uint256 userHighestBurn = highestBurnAmount[user];
        uint256 minIndex = 0;
        bool isInTop = false;

        // Check if the user is already in the top 5 and update their amount
        for (uint256 i = 0; i < topBurners.length; i++) {
            if (topBurners[i].user == user) {
                topBurners[i].amount = userHighestBurn;
                isInTop = true;
                break;
            }
            if (topBurners[i].amount < topBurners[minIndex].amount) {
                minIndex = i;
            }
        }

        if (!isInTop && userHighestBurn > topBurners[minIndex].amount) {
            // If user is not in top 5 and their highest burn amount qualifies
            topBurners[minIndex] = BurnInfo(user, userHighestBurn);
        }

        // Sort the top burners only if needed
        _sortTopBurners();
    }

    // Helper function to sort the top burners by burn amount in descending order
    function _sortTopBurners() internal {
        for (uint256 i = 0; i < topBurners.length - 1; i++) {
            for (uint256 j = i + 1; j < topBurners.length; j++) {
                if (topBurners[i].amount < topBurners[j].amount) {
                    BurnInfo memory temp = topBurners[i];
                    topBurners[i] = topBurners[j];
                    topBurners[j] = temp;
                }
            }
        }
    }

    // Public function to fetch top 5 burners with their amounts
    function getTopBurners() external view returns (BurnInfo[5] memory) {
        return topBurners;
    }

    // Function to fetch top 5 burn records within the last 7 days
    function getTopBurnsLast7Days() external view returns (BurnInfo[5] memory) {
        uint256 sevenDaysAgo = block.timestamp - 7 days;
        BurnInfo[] memory allBurns = new BurnInfo[](users.length); // Temporary array to store all valid burns
        uint256 count = 0;

        // Iterate over the list of users
        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            uint256 highestBurnInLast7Days = 0;

            // Check user's burn history within the last 7 days
            for (uint256 j = 0; j < burnHistory[user].length; j++) {
                BurnRecord memory record = burnHistory[user][j];
                if (record.timestamp >= sevenDaysAgo) {
                    if (record.amount > highestBurnInLast7Days) {
                        highestBurnInLast7Days = record.amount;
                    }
                }
            }

            // If there's a burn within the last 7 days, add it to the list
            if (highestBurnInLast7Days > 0) {
                allBurns[count] = BurnInfo(user, highestBurnInLast7Days);
                count++;
            }
        }

        // Sort the burn records by amount in descending order
        for (uint256 i = 0; i < count - 1; i++) {
            for (uint256 j = i + 1; j < count; j++) {
                if (allBurns[i].amount < allBurns[j].amount) {
                    BurnInfo memory temp = allBurns[i];
                    allBurns[i] = allBurns[j];
                    allBurns[j] = temp;
                }
            }
        }

        // Create an array to hold the top 5 unique burns
        BurnInfo[5] memory top5Burns;
        uint256 uniqueCount = 0;

        // Select top 5 unique burners
        for (uint256 i = 0; i < count && uniqueCount < 5; i++) {
            bool isDuplicate = false;

            // Check for duplicates
            for (uint256 j = 0; j < uniqueCount; j++) {
                if (allBurns[i].user == top5Burns[j].user) {
                    isDuplicate = true;
                    break;
                }
            }

            // If no duplicates found, add to the top 5 list
            if (!isDuplicate) {
                top5Burns[uniqueCount] = allBurns[i];
                uniqueCount++;
            }
        }

        return top5Burns;
    }

    // Function to transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }

    // Function for the owner to withdraw any tokens from the contract
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Withdraw amount must be greater than 0");

        // Transfer tokens to the owner
        bool success = rewardToken.transfer(owner, amount);
        require(success, "Token withdrawal failed");
    }

    // Function for the owner to deposit tokens into the contract
    function depositTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Deposit amount must be greater than 0");

        // Transfer tokens from the owner to the contract
        bool success = rewardToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Token deposit failed");
    }
}

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function burn(uint256 amount) external;
}
