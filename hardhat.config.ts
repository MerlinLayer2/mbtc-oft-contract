// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import "@nomicfoundation/hardhat-verify";

import '@layerzerolabs/toolbox-hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'
import './task/send'
import './type-extensions'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
        ? [PRIVATE_KEY]
        : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    defaultNetwork: 'bnb',
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        bnb: {
            eid: EndpointId.BSC_V2_MAINNET,
            url: 'https://bsc-pokt.nodies.app',
            accounts,
            oftAdapter: {
                tokenAddress: '0x2F913C820ed3bEb3a67391a6eFF64E70c4B20b19', // Set the token address for the OFT adapter
            },
        },
        base: {
            eid: EndpointId.BASE_V2_MAINNET,
            url: 'https://base.llamarpc.com',
            accounts,
        },
        hardhat: {
            // Need this for testing because TestHelperOz5.sol is exceeding the compiled contract size limit
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: '0x58eE238A5aB9e90D063A7B43D498782664dc5716', // wallet address of index[0], of the mnemonic in .env
        },
        admin: {
            bnb: '0x58eE238A5aB9e90D063A7B43D498782664dc5716',
            base: '0x58eE238A5aB9e90D063A7B43D498782664dc5716',
        },
    },
    etherscan: {
        apiKey: {
            mainnet: '24I7PCKY3WJH2685QV25SN5UDKGAX5VIG1',
            base: 'N5EF74NP5UH4T1KDM3NM6BJ1TZAMIZE6F2',
        },
    },
}

export default config
