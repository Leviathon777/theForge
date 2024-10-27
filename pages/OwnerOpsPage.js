import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { OwnerOps } from '../components/componentsindex';
import { useSigner, useAddress } from '@thirdweb-dev/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/ownerOps.module.css';

const OwnerOpsPage = () => {
  const signer = useSigner();
  const address = useAddress();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      if (!signer) return;

      try {
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_MEDAL_CONTRACT_ADDRESS, 
          require('../Context/mohCA_ABI.json').abi,
          signer
        );

        const contractOwner = await contract.owner();
        const authorizedAddresses = process.env.NEXT_PUBLIC_OWNER_ADDRESSES?.split(",").map(addr => addr.toLowerCase()) || [];

        console.log('Connected Wallet Address:', address);
        console.log('Contract Owner Address:', contractOwner);
        console.log('Authorized Addresses from .env:', authorizedAddresses);

        if (address.toLowerCase() === contractOwner.toLowerCase() || authorizedAddresses.includes(address.toLowerCase())) {
          console.log('Authorization Successful: Wallet is authorized.');
          setIsOwner(true);
        } else {
          console.log('Authorization Failed: Wallet is not authorized.');
          setIsOwner(false);
          toast.error('Access Denied: You are not authorized.');
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
    <div className={styles.background}>
      <h1 className={styles.heading}>Owner Operations</h1>
      <ToastContainer position="top-center" />
      
      {isOwner ? (
        <OwnerOps signer={signer} />
      ) : (
        <p>You must be an authorized owner to access this page.</p>
      )}
    </div>
  );
};

export default OwnerOpsPage;
