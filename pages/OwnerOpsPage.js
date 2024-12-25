import React from "react";
import DistributeRevShare from "../components/OwnerOps/DistributeToHolders";
import MohOwnerOps from "../components/OwnerOps/OwnerOps";

const DistributePage = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Medals Of Honor Dashboard</h2>
      <MohOwnerOps />
    </div>
  );
};

export default DistributePage;
