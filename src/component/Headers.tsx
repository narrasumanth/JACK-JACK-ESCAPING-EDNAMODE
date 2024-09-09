import React, { useState, useEffect } from 'react';
import './Header.css';
import detectEthereumProvider from '@metamask/detect-provider';

const Headers = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  async function connectWallet() {
    try {
      const provider = await detectEthereumProvider();
      if (provider && provider === window.ethereum) {
        console.log('MetaMask is available!');
        await requestWalletAccess();
      } else {
        console.log('Please install MetaMask!');
      }
    } catch (err) {
      return { success: false, msg: 'Trouble connecting wallet!' };
    }
  }

  async function requestWalletAccess() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
      startApp(window.ethereum);
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
    }
  }

  function startApp(provider) {
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    } else {
      console.log('Ready to interact with the blockchain.');
      window.location.reload();
    }
  }

  const abbreviateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  useEffect(() => {
    async function checkIfConnected() {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    }
    checkIfConnected();
  }, []);

  return (
    <header className="header">
      <div className="navbar-container">
        <div className="logo-container">
          <img src="" alt="Santa" loading="lazy" className="logo-image" />
          <span className="navbar-title">Santa Game</span>
        </div>
        <div className="button-container">
          {walletAddress ? (
            <span>Connected: {abbreviateAddress(walletAddress)}</span>
          ) : (
            <button onClick={connectWallet}>Connect Now</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Headers;
