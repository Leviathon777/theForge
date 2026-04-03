import React from "react";
import { useAccount } from "wagmi";
import MohOwnerOps from "../components/OwnerOps/OwnerOps";

const DistributePage = () => {
  const { address } = useAccount();

  const authorizedAddresses =
    (process.env.NEXT_PUBLIC_OWNER_ADDRESSES || "")
      .split(",")
      .map((addr) => addr.trim().toLowerCase())
      .filter(Boolean);

  const isAuthorized =
    address && authorizedAddresses.includes(address.toLowerCase());

  if (!isAuthorized) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial", color: "#fff" }}>
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Medals Of Honor Dashboard</h2>
      <MohOwnerOps />
    </div>
  );
};

export default DistributePage;
