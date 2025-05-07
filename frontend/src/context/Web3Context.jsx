import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LostAndFoundArtifact from '../artifacts/contracts/LostAndFound.sol/LostAndFound.json';
import { CONTRACT_ADDRESS } from '../config/contract-config';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const lostAndFoundContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        LostAndFoundArtifact.abi,
        signer
      );

      setAccount(accounts[0]);
      setContract(lostAndFoundContract);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error connecting wallet:', err);
    }
  };

  return (
    <Web3Context.Provider value={{ account, contract, connectWallet, error }}>
      {children}
    </Web3Context.Provider>
  );
};