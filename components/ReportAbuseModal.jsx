import React, { useState } from 'react';
import Style from "./ReportAbuseModal.module.css";
import { useAddress } from "@thirdweb-dev/react";
import {reportAsset} from "../firebase/services";


const ReportAbuseModal = ({ isOpen, onClose, onSubmit, tokenId }) => {
  const [reason, setReason] = useState('');
  const walletAddress = useAddress();
  const handleSubmit = async () => {
    try {     
      const timestamp = new Date().toISOString();
      const response = await reportAsset(tokenId, reason, timestamp, walletAddress);
      console.log(response);
      onClose();
    } catch (error) {
      console.error("Error reporting abuse:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={Style.modal}>
      <div className={Style.modal_content}>
        <h2>REPORT ABUSE</h2>
        <label>
          
          <textarea 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
          placeholder='PLEASE PROVIDE AS DETAILED OF A REASON FOR YOUR REPORT'
          />
        </label>
        <div className={Style.button_box}>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReportAbuseModal;
