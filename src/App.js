import { CONTRACT_ADDRESS } from './config';
// ... existing code ...

const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    LostAndFoundABI,
    signer
);