const {ethers} = require('ethers');

// Addresses
const oappAddress = '0xBd4e65058749c12D62E57BE6B02f313c368E5F0D'; // Replace with your OApp address
const sendLibAddress = '0x6c26c61a97006888ea9E4FA36584c7df57Cd9dA3'; // Replace with your send message library address

// Configuration
const remoteEid = 30184; // Example EID, replace with the actual value
const ulnConfig = {
    confirmations: 512, // Example value, replace with actual
    requiredDVNCount: 1, // Example value, replace with actual
    optionalDVNCount: 0, // Example value, replace with actual
    optionalDVNThreshold: 0, // Example value, replace with actual
    requiredDVNs: ['0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc'], // Replace with actual addresses, must be in alphabetical order
    optionalDVNs: [], // Replace with actual addresses, must be in alphabetical order
};

const executorConfig = {
    maxMessageSize: 10000, // Example value, replace with actual
    executorAddress: '0xCd3F213AD101472e1713C72B1697E727C803885b', // Replace with the actual executor address
};

// Provider and Signer
const provider = new ethers.providers.JsonRpcProvider('https://polygon.llamarpc.com');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ABI and Contract
const endpointAbi = [
    'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
];
const endpointContract = new ethers.Contract('0x1a44076050125825900e736c501f859c50fE728c', endpointAbi, signer);

// Encode UlnConfig using defaultAbiCoder
const configTypeUlnStruct =
    'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';
const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([configTypeUlnStruct], [ulnConfig]);

// Encode ExecutorConfig using defaultAbiCoder
const configTypeExecutorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)';
const encodedExecutorConfig = ethers.utils.defaultAbiCoder.encode(
    [configTypeExecutorStruct],
    [executorConfig],
);

// Define the SetConfigParam structs
const setConfigParamUln = {
    eid: remoteEid,
    configType: 2, // ULN_CONFIG_TYPE
    config: encodedUlnConfig,
};

const setConfigParamExecutor = {
    eid: remoteEid,
    configType: 1, // EXECUTOR_CONFIG_TYPE
    config: encodedExecutorConfig,
};

// Send the transaction
async function sendTransaction() {
    try {
        const tx = await endpointContract.setConfig(
            oappAddress,
            sendLibAddress,
            // [setConfigParamUln, setConfigParamExecutor], // Array of SetConfigParam structs
            [setConfigParamExecutor], // Array of SetConfigParam structs
        );

        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.transactionHash);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

sendTransaction();