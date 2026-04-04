import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleCheck, faClock, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./ProfileCard.module.css";

const ProfileCard = ({ userInfo }) => {
  const kyc = userInfo?.kyc || {};
  const kycStatus = kyc.kycStatus || "not submitted";
  const isVerified = kyc.kycVerified === true;
  const isPending = kycStatus === "completed" && !isVerified;

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <FontAwesomeIcon icon={faUser} /> Investor Profile
      </h2>
      <div className={styles.grid}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Full Name</span>
          <span className={styles.fieldValue}>{userInfo?.fullName || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <span className={styles.fieldValue}>{userInfo?.email || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Territory</span>
          <span className={styles.fieldValue}>{userInfo?.territory || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Phone</span>
          <span className={styles.fieldValue}>{userInfo?.phone || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Date of Birth</span>
          <span className={styles.fieldValue}>{userInfo?.dob || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Member Since</span>
          <span className={styles.fieldValue}>
            {userInfo?.dateOfJoin
              ? new Date(userInfo.dateOfJoin).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : "—"}
          </span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>KYC Status</span>
          <span
            className={`${styles.badge} ${
              isVerified ? styles.badgeVerified : isPending ? styles.badgePending : styles.badgeNone
            }`}
          >
            <FontAwesomeIcon icon={isVerified ? faCircleCheck : isPending ? faClock : faCircleXmark} />
            {isVerified ? "Verified" : isPending ? "Pending" : kycStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
