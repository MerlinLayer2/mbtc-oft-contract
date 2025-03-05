const {ethers} = require('ethers');

// Replace with your actual values
const YOUR_OAPP_ADDRESS = '0xYourOAppAddress';
const YOUR_SEND_LIB_ADDRESS = '0xB5320B0B3a13cC860893E2Bd79FCd7e13484Dda2';
const YOUR_RECEIVE_LIB_ADDRESS = '0xc70AB6f32772f59fBfc23889Caf4Ba3376C84bAf';
const YOUR_ENDPOINT_CONTRACT_ADDRESS = '0xYourEndpointContractAddress';
const YOUR_RPC_URL = 'https://base.llamarpc.com';
const YOUR_PRIVATE_KEY = process.env.PRIVATE_KEY;

// Define the remote EID
const remoteEid = 30184; // Replace with your actual EID

// Set up the provider and signer
const provider = new ethers.providers.JsonRpcProvider(YOUR_RPC_URL);
const signer = new ethers.Wallet(YOUR_PRIVATE_KEY, provider);

// Set up the endpoint contract
const endpointAbi = [
    'function setSendLibrary(address oapp, uint32 eid, address sendLib) external',
    'function setReceiveLibrary(address oapp, uint32 eid, address receiveLib) external',
];
const endpointContract = new ethers.Contract(YOUR_ENDPOINT_CONTRACT_ADDRESS, endpointAbi, signer);

async function setLibraries() {
    try {
        // Set the send library
        const sendTx = await endpointContract.setSendLibrary(
            YOUR_OAPP_ADDRESS,
            remoteEid,
            YOUR_SEND_LIB_ADDRESS,
        );
        console.log('Send library transaction sent:', sendTx.hash);
        await sendTx.wait();
        console.log('Send library set successfully.');

        // Set the receive library
        const receiveTx = await endpointContract.setReceiveLibrary(
            YOUR_OAPP_ADDRESS,
            remoteEid,
            YOUR_RECEIVE_LIB_ADDRESS,
        );
        console.log('Receive library transaction sent:', receiveTx.hash);
        await receiveTx.wait();
        console.log('Receive library set successfully.');
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

setLibraries();