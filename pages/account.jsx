import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useAccount } from "wagmi";
import { publicClient } from "../lib/viemClient";
import { getForger } from "../supabase/forgeServices";
import xdripCA_ABI from "../Context/xdripCA_ABI.json";
import MyDotData, { MyDotDataContext } from "../Context/MyDotDataContext";
import AccountHeader from "../components/Account/AccountHeader";
import ProfileCard from "../components/Account/ProfileCard";
import HoldingsOverview from "../components/Account/HoldingsOverview";
import MedalGrid from "../components/Account/MedalGrid";
import ComplianceCard from "../components/Account/ComplianceCard";
import Footer from "../components/Footer/Footer";

const AccountContent = ({ openModal }) => {
  const { address, isConnected } = useAccount();
  const { dots } = useContext(MyDotDataContext);
  const [userInfo, setUserInfo] = useState(null);
  const [bnbBalance, setBnbBalance] = useState(null);
  const [xdripBalance, setXdripBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile, BNB balance, and XdRiP balance in parallel
        const [profile, bnb, xdrip] = await Promise.all([
          getForger(address).catch(() => null),
          publicClient.getBalance({ address }).catch(() => 0n),
          publicClient.readContract({
            address: xdripCA_ABI.address,
            abi: xdripCA_ABI.abi,
            functionName: "balanceOf",
            args: [address],
          }).catch(() => 0n),
        ]);

        setUserInfo(profile);
        setBnbBalance((Number(bnb) / 1e18).toFixed(4));
        setXdripBalance(Math.floor(Number(xdrip) / 1e9));
      } catch (err) {
        console.error("Error loading account data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [address]);

  if (!isConnected) {
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
      }}>
        <h1 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          background: "linear-gradient(135deg, var(--forge-blue-200) 0%, #fff 40%, var(--forge-blue-200) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Connect Your Wallet
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.95rem",
          color: "var(--color-text-tertiary)",
          textAlign: "center",
          maxWidth: "400px",
        }}>
          Connect your wallet to access your investment account, view your holdings, and manage your profile.
        </p>
        <appkit-button />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        color: "var(--color-text-muted)",
      }}>
        Loading account...
      </div>
    );
  }

  return (
    <>
      <AccountHeader
        address={address}
        bnbBalance={bnbBalance}
        xdripBalance={xdripBalance}
      />

      <div style={{
        maxWidth: "100%",
        margin: "0 auto",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {userInfo ? (
            <>
              <ProfileCard userInfo={userInfo} />
              <HoldingsOverview dots={dots} />
              <MedalGrid dots={dots} />
              <ComplianceCard userInfo={userInfo} />
            </>
          ) : (
            <div style={{
              background: "var(--glass-bg-medium)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              border: "1px solid var(--glass-border-subtle)",
              borderRadius: "var(--radius-xl)",
              padding: "3rem 2rem",
              textAlign: "center",
            }}>
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
                color: "var(--color-text-primary)",
                marginBottom: "0.75rem",
              }}>
                Complete Your Profile
              </h2>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                color: "var(--color-text-tertiary)",
                marginBottom: "1.5rem",
                maxWidth: "500px",
                marginLeft: "auto",
                marginRight: "auto",
              }}>
                Create your investor profile to access the full platform — revenue sharing, medal forging, and account management.
              </p>
              <a
                href="/InvestorProfile"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "0.85rem 2.5rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(37, 95, 244, 0.4)",
                  background: "linear-gradient(135deg, var(--forge-blue-600) 0%, var(--forge-blue-400) 100%)",
                  color: "#fff",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Create Profile
              </a>
            </div>
          )}
        </div>
      </div>

      <Footer openModal={openModal} />
    </>
  );
};

const AccountPage = ({ openModal }) => {
  return (
    <>
      <Head>
        <title>Investment Account | Medals of Honor</title>
        <meta name="description" content="Manage your Medals of Honor investment account — view holdings, profile, compliance status, and medal collection." />
      </Head>

      {/* Fixed dimmed background */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        backgroundImage: "url('/img/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.05,
        pointerEvents: "none",
      }} />

      <main style={{ position: "relative", zIndex: 1 }}>
        <MyDotData>
          <AccountContent openModal={openModal} />
        </MyDotData>
      </main>
    </>
  );
};

export default AccountPage;
