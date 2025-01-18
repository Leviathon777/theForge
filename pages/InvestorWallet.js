import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DotWallet from "../components/DotWallets/DotWallet";
import Style from "../styles/InvestorWallet.module.css";
import MyDotData from "../Context/MyDotDataContext";

const InvestorWallet = () => {
  const router = useRouter();
  const { address, bnbBalance, dripPercent, xdripBalance, userInfo: userInfoString } = router.query;

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
  }, [userInfoString, address, bnbBalance, dripPercent, xdripBalance, router.query]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  return (
    <div className={Style.container}>
      <MyDotData>
        <h1 className={Style.title}>MOH Investor Portal</h1>

        <div className={Style.walletInfoWrapper}>
          <div className={Style.walletInfoContainer}>
            {/* Wallet Information */}
            <div className={Style.card}>
              <div className={Style.titleBox}>
                <h3 className={Style.cardTitle}>Wallet Information</h3>
              </div>
              <div className={Style.infoBox}>
                {[
                  {
                    title: "BNB Balance",
                    value: bnbBalance ? `${parseFloat(bnbBalance).toFixed(4)} BNB` : "N/A",
                  },
                  {
                    title: "XDRIP Balance",
                    value: userInfo?.drip?.dripCount ? `${userInfo.drip.dripCount} XDRIP` : "0 XDRIP",
                  },
                  {
                    title: "XDRIP Supply Percent",
                    value: userInfo?.drip?.dripPercent
                      ? `${(parseFloat(userInfo.drip.dripPercent) * 100).toFixed(2)}%`
                      : "N/A",
                  },
                  {
                    title: "Bonus Qualification",
                    value: userInfo?.drip?.qualifiesForBonus ? "Yes" : "No",
                  },
                  {
                    title: "Wallet Address",
                    value: address
                      ? `${address.slice(0, 6)}...${address.slice(-4)}`
                      : "N/A",
                    fullValue: address,
                  },
                ].map((item, index) => (
                  <div key={index} className={Style.infoRow}>
                    <span className={Style.infoTitle}>{item.title}</span>
                    <span
                      className={Style.infoData}
                      title={item.fullValue || ""}
                      onClick={() => {
                        if (item.fullValue) {
                          navigator.clipboard.writeText(item.fullValue);
                          alert("Copied to clipboard: " + item.fullValue);
                        }
                      }}
                      style={{ cursor: item.fullValue ? "pointer" : "default" }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {userInfo && (
          <div className={Style.cardsWrapper}>
            <div className={Style.cardsContainer}>
              {/* Personal Information */}
              <div className={Style.card}>
                <div className={Style.titleBox}>
                  <h3 className={Style.cardTitle}>Personal Information</h3>
                </div>
                <div className={Style.infoBox}>
                  {[
                    { title: "Name", value: userInfo?.fullName || "N/A" },
                    { title: "Email", value: userInfo?.email || "N/A" },
                    { title: "Phone", value: userInfo?.phone || "N/A" },
                    { title: "Date of Birth", value: formatDate(userInfo?.dob) },
                  ].map((item, index) => (
                    <div key={index} className={Style.infoRow}>
                      <span className={Style.infoTitle}>{item.title}</span>
                      <span className={Style.infoData}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mailing Address */}
              <div className={Style.card}>
                <div className={Style.titleBox}>
                  <h3 className={Style.cardTitle}>Mailing Address</h3>
                </div>
                <div className={Style.infoBox}>
                  {[
                    {
                      title: "Address",
                      value: `${userInfo?.mailingAddress?.streetAddress || "N/A"}${userInfo?.mailingAddress?.apartment ? `, Apt: ${userInfo.mailingAddress.apartment}` : ""
                        }`,
                    },
                    {
                      title: "City & State",
                      value: `${userInfo?.mailingAddress?.city || "N/A"}, ${userInfo?.mailingAddress?.state || "N/A"
                        }`,
                    },
                    { title: "ZIP Code", value: userInfo?.mailingAddress?.zipCode || "N/A" },
                  ].map((item, index) => (
                    <div key={index} className={Style.infoRow}>
                      <span className={Style.infoTitle}>{item.title}</span>
                      <span className={Style.infoData}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KYC Information */}
              <div className={Style.card}>
                <div className={Style.titleBox}>
                  <h3 className={Style.cardTitle}>KYC Information</h3>
                </div>
                <div className={Style.infoBox}>
                  {[
                    { title: "KYC Verified", value: userInfo?.kyc?.kycVerified || "N/A" },
                    { title: "KYC Status", value: userInfo?.kyc?.kycStatus || "N/A" },
                    {
                      title: "KYC Submitted On",
                      value:
                        userInfo?.kyc?.kycSubmittedAt &&
                          userInfo?.kyc?.kycSubmittedAt !== "N/A"
                          ? formatDate(userInfo?.kyc?.kycSubmittedAt)
                          : "N/A",
                    },
                    {
                      title: "KYC Approved On",
                      value:
                        userInfo?.kyc?.kycCompletedAt &&
                          userInfo?.kyc?.kycCompletedAt !== "N/A"
                          ? formatDate(userInfo?.kyc?.kycCompletedAt)
                          : "N/A",
                    },
                  ].map((item, index) => (
                    <div key={index} className={Style.infoRow}>
                      <span className={Style.infoTitle}>{item.title}</span>
                      <span className={Style.infoData}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Details */}
              <div className={Style.card}>
                <div className={Style.titleBox}>
                  <h3 className={Style.cardTitle}>Other Details</h3>
                </div>
                <div className={Style.infoBox}>
                  {[
                    { title: "Territory", value: userInfo?.territory || "N/A" },
                    { title: "UK FCA Agreement", value: userInfo?.ukFCAAgreed ? "Agreed" : "Not Agreed" },
                    { title: "Profile Agreement", value: userInfo?.agreed ? "Agreed" : "Not Agreed" },
                    { title: "Date of Joining", value: formatDate(userInfo?.dateOfJoin) },
                  ].map((item, index) => (
                    <div key={index} className={Style.infoRow}>
                      <span className={Style.infoTitle}>{item.title}</span>
                      <span className={Style.infoData}>{item.value}</span>
                    </div>
                  ))}
                </div>
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