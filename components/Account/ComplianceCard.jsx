import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileShield, faCircleCheck, faMinus } from "@fortawesome/free-solid-svg-icons";
import styles from "./ComplianceCard.module.css";

const ComplianceItem = ({ label, value }) => {
  const isAccepted = value === true || value === "true";
  const isExempt = value === "Exempt";

  return (
    <div className={styles.item}>
      <span className={styles.itemLabel}>{label}</span>
      <span className={`${styles.itemValue} ${isAccepted ? styles.accepted : isExempt ? styles.exempt : styles.pending}`}>
        <FontAwesomeIcon icon={isAccepted ? faCircleCheck : faMinus} />
        {isAccepted ? "Accepted" : isExempt ? "Exempt" : String(value || "—")}
      </span>
    </div>
  );
};

const ComplianceCard = ({ userInfo }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <FontAwesomeIcon icon={faFileShield} /> Compliance & Agreements
      </h2>
      <div className={styles.list}>
        <ComplianceItem label="Terms of Service" value={userInfo?.agreed} />
        <ComplianceItem label="UK FCA Compliance" value={userInfo?.ukFCAAgreed} />
        <ComplianceItem label="EU Compliance" value={userInfo?.euAgreed} />
        <ComplianceItem label="KYC Verification" value={userInfo?.kyc?.kycVerified} />
      </div>
    </div>
  );
};

export default ComplianceCard;
