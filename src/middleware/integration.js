import { ethers } from 'ethers';
import p2eabi from "./p2e.json"
import erc20 from "./ERC20.json"
import detectEthereumProvider from '@metamask/detect-provider';



// Function to claim tokens
export const claimTokens = async (amount) => {
    if (typeof window.ethereum !== 'undefined') {
  
      
      try {
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("test1")
        let provider = await detectEthereumProvider();
        console.log("test2")
        provider = new ethers.providers.Web3Provider(provider)
        console.log("test3")
        const signer = provider.getSigner();
        console.log("test4")
        const contract = new ethers.Contract("0x196F2ED79A910c9091BFC41795CfF6D0Fd671c15", p2eabi, signer);
        console.log("test5")

        // Call the claim function with the specified amount
        const tx = await contract.claim(ethers.utils.parseUnits(amount.toString(), 18));
        await tx.wait();

        setSuccessMessage(`Claimed ${amount} tokens successfully!`);
      } catch (error) {
        console.error(error);
       // setErrorMessage('Error claiming tokens');
      }
    } else {
    //   setErrorMessage('MetaMask not found');
    }
  };