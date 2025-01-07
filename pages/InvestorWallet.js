import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DotWallet from "../components/DotWallets/DotWallet";
import Style from "../styles/InvestorWallet.module.css";
import MyDotData from "../Context/MyDotDataContext";

const InvestorWallet = () => {
  const router = useRouter();
  const { address, userInfo: userInfoString } = router.query;

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (userInfoString) {
      try {
        const parsedUserInfo = JSON.parse(userInfoString);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing userInfoString:", error);
      }
    }
  }, [userInfoString, address, router.query]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  return (
    <div className={Style.container}>
      <MyDotData>
        <h1 className={Style.title}>Investor Wallet</h1>
        <p className={Style.walletAddress}>Wallet Address: {address || "N/A"}</p>
        <div className={Style.walletInfoWrapper}>
          <div className={Style.walletInfoContainer}>
            <div className={Style.walletInfoItem}>
              <span className={Style.walletInfoLabel}>XDRIP Holdings:</span>
              <span className={Style.walletInfoValue}>{userInfo?.drip?.dripHeld ?? "N/A"}</span>
            </div>
            <div className={Style.walletInfoItem}>
              <span className={Style.walletInfoLabel}>XDRIP Supply Percentage:</span>
              <span className={Style.walletInfoValue}>{userInfo?.drip?.supplyPercent ?? "N/A"}</span>
            </div>
          </div>
        </div>


        {userInfo && (
          <div className={Style.cardsWrapper}>
            <div className={Style.cardsContainer}>
              {/* Personal Information */}
              <div className={Style.card}>
                <h3 className={Style.cardTitle}>Personal Information</h3>
                <p>Name: {userInfo.fullName || "N/A"}</p>
                <p>Email: {userInfo.email || "N/A"}</p>
                <p>Phone: {userInfo.phone || "N/A"}</p>
                <p>Date of Birth: {formatDate(userInfo.dob)}</p>
              </div>

              {/* Mailing Address */}
              <div className={Style.card}>
                <h3 className={Style.cardTitle}>Mailing Address</h3>
                <p>
                  Address: {userInfo.mailingAddress?.streetAddress || "N/A"}
                  {userInfo.mailingAddress?.apartment && `, Apt: ${userInfo.mailingAddress.apartment}`}
                </p>
                <p>
                  City: {userInfo.mailingAddress?.city || "N/A"}, State: {userInfo.mailingAddress?.state || "N/A"}
                </p>
                <p>ZIP Code: {userInfo.mailingAddress?.zipCode || "N/A"}</p>
              </div>

              {/* KYC Information */}
              <div className={Style.card}>
                <h3 className={Style.cardTitle}>KYC Information</h3>
                <p>KYC Alert: {userInfo.kycReviewAnswer || "N/A"}</p>
                <p>KYC Status: {userInfo.kycStatus || "N/A"}</p>
                <p>KYC Submitted At: {formatDate(userInfo.kycSubmittedAt)}</p>
                <p>KYC Approved At: {formatDate(userInfo.kycApprovedAt)}</p>
              </div>

              {/* Other Details */}
              <div className={Style.card}>
                <h3 className={Style.cardTitle}>Other Details</h3>
                <p>Territory: {userInfo.territory || "N/A"}</p>
                <p>UK FCA Agreement: {userInfo.ukFCAAgreed ? "Agreed" : "Not Agreed"}</p>
                <p>Profile Agreement: {userInfo.agreed ? "Agreed" : "Not Agreed"}</p>
                <p>Date of Joining: {formatDate(userInfo.dateOfJoin)}</p>
              </div>
            </div>
          </div>
        )}

        <div className={Style.glowingDivider}></div>
        <div className={Style.thirdComponent}>
          <h1 className={Style.componentTitle}>MEDALS OF HONOR WALLET</h1>
          <DotWallet address={address} />
        </div>
      </MyDotData>
    </div>
  );
};

export default InvestorWallet;
