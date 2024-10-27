import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import OwnerOps from '../components/OwnerOps'; 
import { useSigner, useAddress } from '@thirdweb-dev/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OwnerOpsPage = () => {
  const signer = useSigner();
  const address = useAddress();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check if connected wallet is the owner
    const checkOwner = async () => {
      if (!signer) return;
      
      try {
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_MEDAL_CONTRACT_ADDRESS, 
          require('../Context/mohCA_ABI.json').abi,
          signer
        );

        const contractOwner = await contract.owner();
        if (address === contractOwner) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
          toast.error('Access Denied: You are not the owner.');
        }
      } catch (error) {
        console.error('Error checking owner:', error);
      }
    };

    if (signer && address) {
      checkOwner();
    }
  }, [signer, address]);

  return (
    <div>
      <h1>Owner Operations</h1>
      <ToastContainer position="top-center" />
      
      {/* rendercomponent if owner */}
      {isOwner ? (
        <OwnerOps signer={signer} />
      ) : (
        <p>You must be the contract owner to access this page.</p>
      )}
    </div>
  );
};

export default OwnerOpsPage;
