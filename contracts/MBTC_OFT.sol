// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract MBTC_OFT is OFT, Pausable {
    // Blacklist
    mapping(address => bool) public isBlackListed;

    event SetBlackList(address account, bool state);

    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) Ownable(_delegate) {}

    // Blacklist restrict from-address, contains(burn's from-address)
    function _update(address from, address to, uint256 value) override(ERC20) internal virtual whenNotPaused {
        require(!isBlackListed[from], "from is in blackList");
        ERC20._update(from, to, value);
    }

    function setBlackList(address account, bool state) external onlyOwner {
        isBlackListed[account] = state;
        emit SetBlackList(account, state);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }
}
