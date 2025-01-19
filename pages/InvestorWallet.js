import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DotWallet from "../components/DotWallets/DotWallet";
import Style from "../styles/InvestorWallet.module.css";
import MyDotData from "../Context/MyDotDataContext";
import { ethers } from "ethers";
import mohCA_ABI from "../Context/mohCA_ABI.json";
import ipfsHashes from "../Context/ipfsHashes.js";
import Web3 from "web3";
import xdripCA_ABI from "../Context/xdripCA_ABI.json";
import {
  ConnectWallet,
  darkTheme,
  useAddress,
  useConnect,
  useWallet,
  localWallet,
  useSigner,
} from "@thirdweb-dev/react";
const MohAddress = mohCA_ABI.address;
const MohABI = mohCA_ABI.abi;
const fetchMohContract = (signerOrProvider) =>
  new ethers.Contract(MohAddress, MohABI, signerOrProvider);
const XdRiPContractAddress = xdripCA_ABI.address;
const XdRiPContractABI = xdripCA_ABI.abi;
const web3 = new Web3("https://bsc-dataseed1.binance.org/");
const XdRiPContract = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);



const InvestorWallet = () => {
  const router = useRouter();
  const { address, dripPercent, xdripBalance, userInfo: userInfoString } = router.query;
  const signer = useSigner();
  const [userInfo, setUserInfo] = useState(null);
  const [bnbBalance, setBnbBalance] = useState(null);
  useEffect(() => {
    if (userInfoString) {
      try {
        const parsedUserInfo = JSON.parse(userInfoString);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing userInfoString:", error);
      }
    }
  }, [userInfoString, address, dripPercent, xdripBalance, router.query]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (signer && address) {
        const provider = signer.provider;
        if (!provider) {
          console.error("Provider is missing!");
          return;
        }
        try {
          const balance = await provider.getBalance(address);
          const formattedBalance = ethers.utils.formatEther(balance);
          setBnbBalance(formattedBalance);
        } catch (error) {
          console.error("Error fetching BNB balance:", error);
        }
      }
    };
    fetchBalance();
  }, [signer, address]);

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
                      ? `${userInfo.drip.dripPercent}%`
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

              {/* Mailing Address (Conditionally Rendered Labels) */}
              <div className={Style.card}>
                <div className={Style.titleBox}>
                  <h3 className={Style.cardTitle}>Mailing Address</h3>
                </div>
                <div className={Style.infoBox}>
                  {(() => {
                    // We'll destructure for convenience
                    const {
                      streetAddress,
                      apartment,
                      city,
                      state,
                      zipCode,
                    } = userInfo?.mailingAddress || {};

                    if (!userInfo?.territory) {
                      return (
                        <div className={Style.infoRow}>
                          <span className={Style.infoTitle}>Territory</span>
                          <span className={Style.infoData}>N/A</span>
                        </div>
                      );
                    }

                    switch (userInfo.territory) {
                      case "US":
                        return (
                          <>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>Address</span>
                              <span className={Style.infoData}>
                                {streetAddress || "N/A"}
                                {apartment ? `, Apt: ${apartment}` : ""}
                              </span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>City, State</span>
                              <span className={Style.infoData}>
                                {city || "N/A"}, {state || "N/A"}
                              </span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>ZIP Code</span>
                              <span className={Style.infoData}>{zipCode || "N/A"}</span>
                            </div>
                          </>
                        );

                      case "UK":
                        return (
                          <>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>Address</span>
                              <span className={Style.infoData}>
                                {streetAddress || "N/A"}
                                {apartment ? `, Apt: ${apartment}` : ""}
                              </span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>City or Town</span>
                              <span className={Style.infoData}>{city || "N/A"}</span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>County</span>
                              <span className={Style.infoData}>{state || "N/A"}</span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>Postcode</span>
                              <span className={Style.infoData}>{zipCode || "N/A"}</span>
                            </div>
                          </>
                        );

                      case "EU":
                        return (
                          <>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>Address</span>
                              <span className={Style.infoData}>
                                {streetAddress || "N/A"}
                                {apartment ? `, Apt: ${apartment}` : ""}
                              </span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>City</span>
                              <span className={Style.infoData}>{city || "N/A"}</span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>Region/Province/State</span>
                              <span className={Style.infoData}>{state || "N/A"}</span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>Postal Code</span>
                              <span className={Style.infoData}>{zipCode || "N/A"}</span>
                            </div>
                          </>
                        );

                      default:
                        return (
                          <>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>Address</span>
                              <span className={Style.infoData}>
                                {streetAddress || "N/A"}
                                {apartment ? `, Apt: ${apartment}` : ""}
                              </span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>City or Region</span>
                              <span className={Style.infoData}>{city || "N/A"}</span>
                            </div>
                            <div className={Style.infoRow}>
                              <span className={Style.infoTitle}>Postal Code</span>
                              <span className={Style.infoData}>{zipCode || "N/A"}</span>
                            </div>
                          </>
                        );

                    }
                  })()}
                </div>
              </div>

              {/* KYC Information */}
              <div className={Style.card}>
                <div className={Style.titleBox}>
                  <h3 className={Style.cardTitle}>KYC Information</h3>
                </div>
                <div className={Style.infoBox}>
                  {[
                    {
                      title: "KYC Verified",
                      value: typeof userInfo?.kyc?.kycVerified === "boolean" ? userInfo.kyc.kycVerified.toString() : "N/A"
                    },

                    { title: "KYC Status", value: userInfo?.kyc?.kycStatus || "N/A" },
                    {
                      title: "KYC Submitted On",
                      value:
                        userInfo?.kyc?.kycSubmittedAt && userInfo?.kyc?.kycSubmittedAt !== "N/A"
                          ? formatDate(userInfo.kyc.kycSubmittedAt)
                          : "N/A",
                    },
                    {
                      title: "KYC Approved On",
                      value:
                        userInfo?.kyc?.kycCompletedAt && userInfo?.kyc?.kycCompletedAt !== "N/A"
                          ? formatDate(userInfo.kyc.kycCompletedAt)
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
                    {
                      title: "UK FCA Agreement",
                      value: userInfo?.ukFCAAgreed === "Exempt"
                        ? "Exempt"
                        : userInfo?.ukFCAAgreed
                          ? "Agreed"
                          : "Not Agreed",
                    },
                    {
                      title: "EU Compliance Agreement",
                      value: userInfo?.euAgreed === "Exempt"
                        ? "Exempt"
                        : userInfo?.euAgreed
                          ? "Agreed"
                          : "Not Agreed",
                    },

                    {
                      title: "XDRIP User Agreement",
                      value: userInfo?.agreed ? "Agreed" : "Not Agreed",
                    },
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
