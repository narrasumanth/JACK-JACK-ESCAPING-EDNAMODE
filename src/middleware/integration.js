import { ethers } from 'ethers';
import p2eabi from './p2e.json';
import erc20 from './ERC20.json';
import detectEthereumProvider from '@metamask/detect-provider';
const ContractAddress = "0x6b3BcE6A4e65e0769B939aE88046Ff185F40C263";

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
        ContractAddress,
        p2eabi,
        signer
      );
      console.log('test5');

      // Call the claim function with the specified amount
      const tx = await contract.burn(
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
    console.log("working1")
    const provider = new ethers.providers.JsonRpcProvider(
      'https://testnet-rpc.meld.com'
    );
    const contract = new ethers.Contract(
      ContractAddress,
      p2eabi,
      provider
    );
    const [addresses, scores] = await contract.getTopBurners();
    const ranking = addresses.map((addr, i) => ({
      address: addr,
      score: ethers.utils.formatUnits(scores[i], 18),
    }));
    return ranking;
  } catch (error) {
    console.log("working1000")
    console.error('Error fetching all-time ranking:', error);
  }
};


export const totalBurn = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://testnet-rpc.meld.com'
    );
    const contract = new ethers.Contract(
      ContractAddress,
      p2eabi,
      provider
    );
    let value = await contract.totalAmountBurned();
   
    value = ethers.utils.formatUnits(value, 18);
    
    return value;
  } catch (error) {
    console.error('Error fetching all-time ranking:', error);
  }
};


export const totalBurnByUser = async (address) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://testnet-rpc.meld.com'
    );
    const contract = new ethers.Contract(
      ContractAddress,
      p2eabi,
      provider
    );
    let value = await contract.totalBurnPerAddress(address);
   
    value = ethers.utils.formatUnits(value, 18);
    
    return value;
  } catch (error) {
    console.error('Error fetching all-time ranking:', error);
  }
};




export const fetchLast7DaysRanking = async () => {
  try {
    console.log("working1")
    const provider = new ethers.providers.JsonRpcProvider(
      'https://testnet-rpc.meld.com'
    );
    const contract = new ethers.Contract(
      ContractAddress,
      p2eabi,
      provider
    );
    const [addresses, scores] = await contract.getTopBurnsLast7Days();
    const ranking = addresses.map((addr, i) => ({
      address: addr,
      score: ethers.utils.formatUnits(scores[i], 18),
    }));
    console.log(ranking,">>>>>>>>>>>>>>>>>>>😂")
    return ranking;
  } catch (error) {
    console.log("working1000")
    console.error('Error fetching all-time ranking:', error);
  }
}