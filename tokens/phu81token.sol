pragma solidity ^0.8.0;

contract Phu81Token {
    event Transfer(address indexed from, address indexed to, uint256 value);

    string public name = "Phu81 Token";
    string public symbol = "PHU81";
    uint256 public totalSupply = 1000000000;

    mapping(address => uint256) public balanceOf;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Invalid recipient");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);

        return true;
    }
}
