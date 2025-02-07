// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
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
    defaultNetwork: 'ethereum',
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
        'ethereum': {
            eid: EndpointId.ETHEREUM_V2_MAINNET,
            url: 'https://eth.llamarpc.com',
            accounts,
            oftAdapter: {
                tokenAddress: '0x2F913C820ed3bEb3a67391a6eFF64E70c4B20b19', // Set the token address for the OFT adapter
            },
        },
        'base': {
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
            default: '0x71998C1f8E429BFbADa5FB6C7f23C374e5b411C1', // wallet address of index[0], of the mnemonic in .env
        },
        admin: {
            ethereum: '0xf0B903d928353EfC4C0639a04F128F18CFB38E06', 
            base: '0x62184Bc4160421d5DF310EBfE33F5B8136f38915', 
        },
    },
}

export default config
