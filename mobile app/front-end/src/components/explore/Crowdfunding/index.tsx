// "use client";

// import { useProposal } from "@/ContextProviders/ProposalProvider";
// import { useEffect, useState } from "react";
// import Lottie from "lottie-react";
// import notFound from "@/components/Empty/notFound.json";
// import Button from "@/components/common/Button";
// import { ethers } from "ethers";
// import TokenStarterCollab from "@/abi/TokenStarterCollab.json";
// import MyTokenABI from "@/abi/MyToken.json";
// import { enqueueSnackbar } from "notistack";
// import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
// import {useWallet} from '@suiet/wallet-kit';
// import { TransactionBlock } from '@mysten/sui.js/transactions';


// let erc20ContractAddress = "";
// let stakingContractAddress = "";
// // let provider: ethers.providers.Web3Provider | null = null;
// // let signer = null;
// // let erc20Contract: ethers.Contract;
// // let stakingContract: ethers.Contract;
// const Crowdfunding = () => {
//   const [mintingDone, setMintingDone] = useState<boolean>(false);
//   const [isMinting, setIsMinting] = useState<boolean>(false);
//   const [isStaked, setIsStaked] = useState<boolean>(false);
//   const [isStaking, setIsStaking] = useState<boolean>(false);
//   const [StakingDone, setStakingDone] = useState<boolean>(false);
//   // ------------------------
//   const [salePrice, setSalePrice] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [crowdFundingGoal, setCrowdFundingGoal] = useState<string | null>(null);
//   const [totalFunding, setTotalFunding] = useState<string | null>(null);
//   const [connectedNetwork, setConnectedNetwork] = useState<number | null>(null);
//   const [isCreatorAlreadyStaked, setIsCreatorAlreadyStaked] = useState(false);
  


//   const { proposal } = useProposal();
//   const client = new SuiClient({ url: getFullnodeUrl('devnet') });
// //   // Get wallet signing function
// const wallet = useWallet();

// // // Define Move package ID

// // // Create new TransactionBlock
// const tx = new TransactionBlock();
// const [coin] = tx.splitCoins(tx.gas, [1])
// useEffect(() => {
//   if (!wallet.connected) return;
//   console.log('connected wallet name: ', wallet.name)
//   console.log('account address: ', wallet.account?.address)
//   console.log('account publicKey: ', wallet.account?.publicKey)
// }, [wallet.connected])


// // // Define user object
// // const user = tx.object("0x...");

//   // --------------------------
//   // useEffect(() => {
//   //   erc20ContractAddress = "0x8563F7BD1fa85cB75EFB8e710D3971dC3e3C5C8b";
//   //   stakingContractAddress = "0x2D47f97caE66f5D1582750790F36F57D29A571EA";

//   //   if (typeof window !== "undefined" && window.ethereum) {
//   //     provider = new ethers.providers.Web3Provider(window.ethereum);
//   //     const signer = provider.getSigner();
//   //     console.log("done");
//   //     setIsLoading(false);
//   //     erc20Contract = new ethers.Contract(
//   //       erc20ContractAddress,
//   //       MyTokenABI,
//   //       signer
//   //     );
//   //     stakingContract = new ethers.Contract(
//   //       stakingContractAddress,
//   //       TokenStarterCollab,
//   //       signer
//   //     );
//   //   }
//   // }, []);

//   // --------------------------

//   // useEffect(() => {
//   //   async function getNetwork() {
//   //     if (provider) {
//   //       const network = await provider.getNetwork();
//   //       setConnectedNetwork(network.chainId);
//   //     }
//   //   }
//   //   getNetwork();
//   // }, [provider]);

//   // ------------
//   // useEffect(() => {
//   //   async function fetchData() {
//   //     try {
//   //       const price = await stakingContract.salePrice();
//   //       setSalePrice(ethers.utils.formatEther(price));

//   //       const goal = await stakingContract.crowdFundingGoal();
//   //       setCrowdFundingGoal(ethers.utils.formatEther(goal));

//   //       const totalSupply = await stakingContract.totalSupply();
//   //       const nftFunding = totalSupply.mul(price);

//   //       let total = nftFunding;

//   //       if (isCreatorAlreadyStaked) {
//   //         const stakedAmount = goal
//   //           .mul(ethers.BigNumber.from("20"))
//   //           .div(ethers.BigNumber.from("100"));
//   //         total = total.add(stakedAmount);
//   //       }

//   //       setTotalFunding(ethers.utils.formatEther(total));
//   //     } catch (error: any) {
//   //       console.error("Error fetching data:", error.message);
//   //     }
//   //     setIsLoading(false);
//   //   }
//   //   fetchData();
//   // }, [stakingContract, isCreatorAlreadyStaked]);

//   // -------------------------

//   // ----------------
//   // useEffect(() => {
//   //   async function checkIsCreatorStaked() {
//   //     try {
//   //       const staked = await stakingContract.isCreatorStaked();
//   //       setIsCreatorAlreadyStaked(staked);
//   //     } catch (error: any) {
//   //       console.error("Error checking if creator is staked:", error.message);
//   //     }
//   //   }

//   //   if (proposal) {
//   //     checkIsCreatorStaked();
//   //   }
//   // }, [proposal, stakingContract]);
//   // ------------
//   // async function handleStake() {
//   //   try {
//   //     // // const weiSalePrice = ethers.utils.formatEther(salePrice!);
//   //     // const weiSalePrice = ethers.utils.parseEther(salePrice!.toString());

//   //     setIsStaking(true);
//   //     // Approve the staking contract
//   //     const approveTx = await erc20Contract.approve(
//   //       stakingContractAddress,
//   //       "2000000000000000000"
//   //     );
//   //     await approveTx.wait();
//   //     // Mint the token
//   //     const mintTx = await stakingContract.stake("2000000000000000000");

//   //     await mintTx.wait();

//   //     // display post minting button options
//   //     setStakingDone(true);
//   //     setIsStaked(true);
//   //     enqueueSnackbar(`Stake is successfully!`, {
//   //       variant: "success",
//   //     });
//   //   } catch (error: any) {
//   //     console.log(error);

//   //     enqueueSnackbar(error, {
//   //       variant: "error",
//   //     });
//   //   }
//   // }

//   // async function handleMint() {
//   //   try {
//   //     // const weiSalePrice = ethers.utils.formatEther(salePrice!);
//   //     const weiSalePrice = ethers.utils.parseEther(salePrice!.toString());

//   //     setIsMinting(true);
//   //     // Approve the staking contract
//   //     const approveTx = await erc20Contract.approve(
//   //       stakingContractAddress,
//   //       weiSalePrice
//   //     );
//   //     await approveTx.wait();
//   //     // Mint the token
//   //     const mintTx = await stakingContract.mintTicket();

//   //     await mintTx.wait();

//   //     // display post minting button options
//   //     setMintingDone(true);
//   //     enqueueSnackbar(`Token minted successfully!`, {
//   //       variant: "success",
//   //     });
//   //   } catch (error: any) {
//   //     console.log(error);

//   //     enqueueSnackbar(error, {
//   //       variant: "error",
//   //     });
//   //   }
//   // }
//   // ---------

//   async function handleStake() {
//     if (!wallet.connected) return
//     console.log('current connected chain (network)', wallet.chain?.name)
//     const tx = new TransactionBlock();
//     const packageObjectId = "0x672b0cd932ab1966d16f93073c26b98270ff7d98df10ac15d904565e1875441b";
//     tx.moveCall({
//       target: `${packageObjectId}::Stack::Stack`,
//       arguments: [tx.pure(""),
//       coin,
//       ],
      
//     });
//     // await wallet.signAndExecuteTransactionBlock({
//     //   transactionBlock: tx,
      
//     // });
//     try {
//       // execute the programmable transaction
//       const resData = await wallet.signAndExecuteTransactionBlock({
//         transactionBlock: tx
//       });
//       console.log('nft minted successfully!', resData);
//       alert('Congrats! your nft is minted!')
//     } catch (e) {
//       console.error('nft mint failed', e);
//     }
//   } 
  
  


//   // if (isLoading) {
//   //   return <p>Loading...</p>;
//   // }

//   // ----------------
//   // ---------------------
//   if (!proposal)
//     return (
//       <div className="flex flex-col gap-4 justify-center  items-center mt-20">
//         <Lottie animationData={notFound} loop={true} />
//         <div className="text-lg">No Crowdfunding Event</div>
//       </div>
//     );
//   return (
//     <>
//       <div className="flex justify-center  mb-6 bg-gradient-to-t from-purple-900 via-purple-600 to-black animate-gradient p-60">
//         <div className=" text-sm border py-8 px-8 max-w-xl  rounded-md lex flex-col gap-4 shadow border-gray-600 shadow-2xl bg-slate-950">
//           <div className="text-xl font-bold text-white">{proposal.title}</div>
//           <div className="text-base mt-4 mb-3 text-white">
//             <p>{proposal.description}</p>
//           </div>

//           {/* -------------------  */}
//           <div>
//             {mintingDone ? (
//               <div className="flex gap-3">
//                 <Button variant="secondary" size="sm">
//                   Withdraw Funds
//                 </Button>
//                 <Button variant="secondary" size="sm">
//                   Dispute
//                 </Button>
//                 <Button variant="secondary" size="sm">
//                   Claimback
//                 </Button>
//               </div>
//             ) : (
//               <div className="mt-4">
//                 {isStaked && (
//                   <Button variant="primary" size="md" >
//                     {isMinting ? "Minting..." : "Mint NFT"}
//                   </Button>
//                 )}
//                 {!isStaked && (
//                   <Button variant="primary" size="md" onClick={handleStake}>
//                     {isStaking ? "Staking..." : "Stake Token"}
//                   </Button>
//                 )}
//               </div>
//             )}
//           </div>
//           {/* -------------------  */}
//           {/* <Button variant="primary" size="md" onClick={handleMint}>
//             {isMinting ? "Minting..." : "  Mint NFT"}
//           </Button> */}
//           {isStaked && (
//             <div className="mt-4">
//               <p>Funding Progress:</p>
//               <div className="w-full h-4 bg-gray-300 rounded">
//                 <div
//                   style={{ width: `${5}%` }}
//                   className="h-full bg-blue-500 rounded"
//                 ></div>
//               </div>
//               <p>{2 / 5} ETH</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };


// export default Crowdfunding;
"use client"
import React, { useState } from 'react';

const BoxComponent = () => {
  const [loading, setLoading] = useState(false);
  const [showMint, setShowMint] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const progressValue = 10; // Constant progress value for 0.4 ETH

  const handleStakeTokenClick = () => {
    setLoading(true);
    // Simulate an asynchronous action, like an API call
    setTimeout(() => {
      setLoading(false);
      setShowMint(true); // Show "Mint" after "Stacking"
    }, 2000); // 2 seconds

    // You can perform additional actions here if needed
  };

  const handleMintClick = () => {
    setLoading(true);
    // Simulate an asynchronous action, like an API call
    setTimeout(() => {
      setLoading(false);
      setShowButtons(true); // Show the three buttons after "Minting..."
    }, 2000); // 2 seconds

    // You can perform additional actions here if needed
  };

  return (
    <div className="flex justify-center">
      <div className="bg-gray-200  rounded-lg shadow-lg m-5 p-10 ">
        <h1 className="text-2xl font-bold m-2">Our Gaming StartUp</h1>
        <p className="text-gray-700 mb-4">
        🚀 Join Us in Crafting the Future of Gaming! 🎮<br/>

At R Gaming, we're not just building games; we're creating immersive worlds, unforgettable experiences, and a community-driven platform that's redefining the gaming landscape. Our team of passionate developers, designers, and gamers are on a mission to bring innovation to every pixel and revolutionize how people play and connect.
<br/>

🌟 Why Invest in Us?<br/>

Innovative Gameplay: We're not satisfied with the status quo. Our games are pushing boundaries with innovative gameplay mechanics that keep players engaged and excited.
<br/>
Community-Centric: Gamers are at the heart of everything we do. We're not just building games; we're cultivating a thriving community where players feel heard and valued.
   </p>
        {!showButtons && (
          <>
            {!showMint && (
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'cursor-not-allowed' : ''}`}
                onClick={handleStakeTokenClick}
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Stacking...' : 'Stake Token'}
              </button>
            )}
            {showMint && (
              <>
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'cursor-not-allowed' : ''}`}
                  onClick={handleMintClick}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? 'Minting...' : 'Mint'}
                </button>
                {loading && <p>Loading...</p>}
                {!loading && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Funding Progress</p>
                    <div className="bg-gray-300 h-8 rounded-lg">
                      <div
                        className="bg-blue-500 h-full rounded-lg"
                        style={{ width: `${progressValue}%` }} // Set the width dynamically based on the progress
                      ></div>
                    </div>
                    <p className="mt-2">0.4 ETH</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
        {showButtons && (
          <>
            <div className="mt-4 space-x-4">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Withdraw Funds
              </button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Dispute
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Call Me Back
              </button>
            </div>
            <div className="mt-4">
              <p className="font-semibold mb-2">Funding Progress</p>
              <div className="bg-gray-300 h-8 rounded-lg">
                <div
                  className="bg-blue-500 h-full rounded-lg"
                  style={{ width: `${progressValue}%` }} // Set the width dynamically based on the progress
                ></div>
              </div>
              <p className="mt-2">0.4 ETH</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BoxComponent;
