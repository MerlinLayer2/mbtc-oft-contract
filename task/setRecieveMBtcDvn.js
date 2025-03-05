const {ethers} = require('ethers');

// Addresses
const oappAddress = '0x32491B669cdaaC8DdE29C28EaE0cBf5A844f1d56'; // Replace with your OApp address
const receiveLibAddress = '0xc70AB6f32772f59fBfc23889Caf4Ba3376C84bAf'; // Replace with your receive message library address

// Configuration
const remoteEid = 30109; // Example EID, replace with the actual value
const ulnConfig = {
    confirmations: 10, // Example value, replace with actual
    requiredDVNCount: 1, // Example value, replace with actual
    optionalDVNCount: 0, // Example value, replace with actual
    optionalDVNThreshold: 0, // Example value, replace with actual
    requiredDVNs: ['0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc'], // Replace with actual addresses, must be in alphabetical order
    optionalDVNs: [], // Replace with actual addresses, must be in alphabetical order
};

// Provider and Signer
const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ABI and Contract
const endpointAbi = [
    'function setConfig(address oappAddress, address receiveLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
];
const endpointContract = new ethers.Contract('0x1a44076050125825900e736c501f859c50fE728c', endpointAbi, signer);

// Encode UlnConfig using defaultAbiCoder
const configTypeUlnStruct =
    'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';
const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([configTypeUlnStruct], [ulnConfig]);

// Define the SetConfigParam struct
const setConfigParam = {
    eid: remoteEid,
    configType: 2, // RECEIVE_CONFIG_TYPE
    config: encodedUlnConfig,
};

console.log('xxxx, ulnConfig = ', ulnConfig);
console.log('xxxx, setConfigParam = ', setConfigParam);
// return;

// Send the transaction
async function sendTransaction2() {
    try {
        const tx = await endpointContract.setConfig(
            oappAddress,
            receiveLibAddress,
            [setConfigParam], // This should be an array of SetConfigParam structs
        );

        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.transactionHash);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

sendTransaction2();