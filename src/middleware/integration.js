import { ethers } from 'ethers';
import p2eabi from './p2e.json';
import erc20 from './ERC20.json';
import detectEthereumProvider from '@metamask/detect-provider';

// Function to claim tokens
export const claimTokens = async (amount) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log('test1');
      let provider = await detectEthereumProvider();
      console.log('test2');
      provider = new ethers.providers.Web3Provider(provider);
      console.log('test3');
      const signer = provider.getSigner();
      console.log('test4');
      const contract = new ethers.Contract(
        '0xde104384697D1318652042c42bbf34e2206B2fd8',
        p2eabi,
        signer
      );
      console.log('test5');

      // Call the claim function with the specified amount
      const tx = await contract.claim(
        ethers.utils.parseUnits(amount.toString(), 18)
      );
      await tx.wait();
      return 'success';

      setSuccessMessage(`Claimed ${amount} tokens successfully!`);
    } catch (error) {
      console.error(error);
      // setErrorMessage('Error claiming tokens');
    }
  } else {
    //   setErrorMessage('MetaMask not found');
  }
};

// Function to fetch all-time top 5 ranking
export const fetchAllTimeRanking = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://testnet-rpc.meld.com'
    );
    const contract = new ethers.Contract(
      '0xde104384697D1318652042c42bbf34e2206B2fd8',
      p2eabi,
      provider
    );
    const [addresses, scores] = await contract.getAllTimeTop5();
    const ranking = addresses.map((addr, i) => ({
      address: addr,
      score: ethers.utils.formatUnits(scores[i], 18),
    }));
    console.log('ranking', ranking)
    return ranking;
  } catch (error) {
    console.error('Error fetching all-time ranking:', error);
  }
};

// Function to fetch last 7 days top 5 ranking
export const fetchLast7DaysRanking = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://testnet-rpc.meld.com'
    );
    const contract = new ethers.Contract(
      '0xde104384697D1318652042c42bbf34e2206B2fd8',
      p2eabi,
      provider
    );

    const [addresses, scores] = await contract.getLast7DaysTop5();
    const ranking = addresses.map((addr, i) => ({
      address: addr,
      score: ethers.utils.formatUnits(scores[i], 18),
    }));
    return ranking;
  } catch (error) {
    console.error('Error fetching last 7 days ranking:', error);
  }
};
