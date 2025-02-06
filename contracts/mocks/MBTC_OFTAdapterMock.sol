// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { MBTC_OFTAdapter } from "../MBTC_OFTAdapter.sol";

// @dev WARNING: This is for testing purposes only
contract MBTC_OFTAdapterMock is MBTC_OFTAdapter {
    constructor(address _token, address _lzEndpoint, address _delegate) MBTC_OFTAdapter(_token, _lzEndpoint, _delegate) {}
}
