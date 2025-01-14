import React, { useState } from "react";
import { ethers } from "ethers";
import mohCA from "../Context/mohCA_ABI.json"; // Adjust the path as needed

function NextDOTId() {
  const [tier, setTier] = useState(1); // Default to "Common" tier
  const [nextTokenId, setNextTokenId] = useState(null);

  const fetchNextTokenId = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mohCA.address, mohCA.abi, signer);
      const forgedCounts = await contract.getforgedCounts();

      let currentCounter;
      let offset;

      switch (tier) {
        case 1: // common
          currentCounter = forgedCounts[0]; 
          offset = 1;
          break;
        case 2: // uncommon
          currentCounter = forgedCounts[2]; 
          offset = 10001;
          break;
        case 3: // rare
          currentCounter = forgedCounts[4]; 
          offset = 15001;
          break;
        case 4: // epic
          currentCounter = forgedCounts[6]; 
          offset = 17501;
          break;
        case 5: // legendary
          currentCounter = forgedCounts[8]; 
          offset = 18501;
          break;
        case 6: // eternal
          currentCounter = forgedCounts[10];
          offset = 20001;
          break;
        default:
          throw new Error("Invalid tier selected");
      }

      const nextId = offset + parseInt(currentCounter.toString(), 10);
      setNextTokenId(nextId);
    } catch (error) {
      console.error("Error fetching next token ID:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Next Token ID Fetcher</h3>
      <div style={{ margin: "10px 0" }}>
        <label htmlFor="tier-select" style={{ marginRight: "10px" }}>
          Select Tier:
        </label>
        <select
          id="tier-select"
          value={tier}
          onChange={(e) => setTier(Number(e.target.value))}
          style={{ padding: "5px" }}
        >
          <option value={1}>Common</option>
          <option value={2}>Uncommon</option>
          <option value={3}>Rare</option>
          <option value={4}>Epic</option>
          <option value={5}>Legendary</option>
          <option value={6}>Eternal</option>
        </select>
      </div>
      <button
        onClick={fetchNextTokenId}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Fetch Next DOT ID
      </button>
      {nextTokenId !== null && (
        <p style={{ marginTop: "20px", fontSize: "16px" }}>
          <strong>Next Token ID:</strong> {nextTokenId}
        </p>
      )}
    </div>
  );
}

export default NextDOTId;
