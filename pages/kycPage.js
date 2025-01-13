import React, { useState, useEffect } from 'react';
import styles from '../styles/KYCPage.module.css';
import { Button } from "../components/componentsindex";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateApplicantStatusInFirebase } from "../firebase/forgeServices";


const KYCPage = () => {
  const [formUrl, setFormUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [kycStarted, setKycStarted] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [isReminderPopupVisible, setIsReminderPopupVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState(null);
  const [randomImage, setRandomImage] = useState(null);
  const imagePaths = [
    '/img/KYC1.png',
    '/img/KYC2.png',
    '/img/KYC3.png',
    '/img/KYC4.png',
    '/img/KYC5.png',
    '/img/KYC6.png',
    '/img/KYC7.png',
    '/img/KYC8.png',
  ];

  useEffect(() => {
    if (router.isReady) {
      if (router.query.userInfo) {
        try {
          const parsedUserInfo = JSON.parse(router.query.userInfo);
          if (parsedUserInfo && typeof parsedUserInfo === 'object') {
            setUserData(parsedUserInfo);
            setKycStatus(parsedUserInfo.kyc?.kycStatus || null);
            console.log("Parsed User Info:", parsedUserInfo);
          } else {
            console.warn("Parsed userInfo is not a valid object:", parsedUserInfo);
          }
        } catch (error) {
          console.error("Error parsing userInfo:", error);
        }
      } else {
        console.log("userInfo is not present in query params.");
      }
      if (router.query.address) {
        console.log("Wallet Address:", router.query.address);
        setWalletAddress(router.query.address);
      }
    }
  }, [router.isReady, router.query.userInfo, router.query.address]);


  useEffect(() => {
    if (kycStatus === "completed") {
      const randomIndex = Math.floor(Math.random() * imagePaths.length);
      setRandomImage(imagePaths[randomIndex]);
    }
  }, [kycStatus]);


  const fetchFormUrl = async () => {
    setLoading(true);
    console.log("Sending walletAddress:", userData.walletAddress);
    try {
      const response = await fetch('/api/kycaid-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: '3cb68f2c002d714c821b92b0765545f633ad',
          external_applicant_id: userData.walletAddress,
          redirect_url: '',
        }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error response:', errorData);
        throw new Error(`Failed to fetch form URL. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Form URL fetched:', data.form_url);
      setFormUrl(data.form_url);
      setKycStarted(true);
    } catch (error) {
      console.error('Error fetching form URL:', error);
      toast.error('Failed to start KYC verification.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      console.log("Received message event:", event); // Full event for debugging
      console.log("Event data:", event.data); // Log the message payload
  
      // Validate the message origin
      if (event.origin !== "https://forms-new.kycaid.com") {
        console.warn("Ignored message from unauthorized origin:", event.origin);
        return;
      }
  
      const { event: messageEvent, verification_id, external_applicant_id } = event.data;
  
      if (messageEvent === "FORM_COMPLETED") {
        console.log("FORM_COMPLETED event detected with data:", { verification_id, external_applicant_id });
  
        // Use external_applicant_id or fallback to walletAddress from userData
        const applicantId = external_applicant_id || userData?.walletAddress;
  
        if (!applicantId) {
          console.error("Missing external_applicant_id and fallback walletAddress.");
          return;
        }
  
        const updateData = {
          kyc: {
            kycStatus: "submitted",
            kycSubmittedAt: new Date().toISOString(),
            kycReviewAnswer: "false",
          },
        };
  
        try {
          console.log("Updating Firebase with applicantId:", applicantId);
          await updateApplicantStatusInFirebase(applicantId, updateData);
          toast.success("KYC process completed successfully.");
        } catch (error) {
          console.error("Error updating Firebase:", error);
          toast.error("Failed to update KYC status.");
        }
      } else {
        console.warn("Unexpected message event type:", messageEvent);
      }
    };
  
    // Add the event listener
    window.addEventListener("message", handleMessage);
  
    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [userData]);
  
  


  const handleBeginKYC = () => {
    if (!userData) {
      setIsReminderPopupVisible(true);
      return;
    }
    fetchFormUrl();
  };

  const handleProfileRedirect = () => {
    if (walletAddress) {
      router.push({
        pathname: "/InvestorProfile",
        query: { address: walletAddress },
      });
    } else {
      toast.error("Wallet address not available. Please connect your wallet.");
    }
  };




  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <h1 className={styles.title}>Know Your XDRIP Customer</h1>
          <div className={styles.walkthrough_wrapper}>
            <section className={styles.walkthrough}>
              <div className={styles.topperTitle}>
              <h5>
                <strong>Welcome to XDRIP Digital Management's Identity Verification Submission Portal</strong>
              </h5>
              </div>
              <p>
                At XDRIP Digital Management, your security and privacy are at the core of everything we do. To ensure a safe and trusted environment, we partner with KYCAID for seamless identity verification.
              </p>
              <h2>Why Verify Your Identity?</h2>
              <ul>
                <li>
                  <strong>Security First:</strong> Protect your account from unauthorized access and fraud.
                </li>
                <li>
                  <strong>Compliance Matters:</strong> Meet global regulatory requirements effortlessly.
                </li>
                <li>
                  <strong>Unlock Premium Features:</strong> Access exclusive benefits, like the "Eternal Medal."
                </li>
              </ul>
              <h2>A Trusted Verification Process</h2>
              <p>
                We’ve partnered with KYCAID, a leader in secure identity verification, to provide a smooth and confidential KYC experience. Your data is handled with the highest level of security, in full compliance with GDPR and global privacy standards.
              </p>

            </section>
            <div className={styles.button_wrapper}>
              <Button
                btnName="Return To The Forge"
                onClick={() => router.push('/TheForge')}
                className={styles.kycButton}
                fontSize="inherit"
              />
            </div>
          </div>
        </div>

        <div className={styles.verticalLine}></div>
        <div className={styles.right}>
          {kycStatus === "completed" && userData?.kyc?.kycReviewAnswer === "true" ? (
            <img
              src={randomImage}
              alt="KYC Approved"
              className={styles.right_image}
              style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
            />
          ) : !kycStarted ? (
            <Button
              btnName="Begin KYC Verification"
              onClick={handleBeginKYC}
              className={styles.kycButton}
              fontSize="inherit"
              disabled={loading}
            />
          ) : formUrl ? (
            <iframe
              src={formUrl}
              style={{
                width: '100%',
                maxWidth: '600px',
                minHeight: '700px',
                margin: '0 auto',
                border: 'none',
                borderRadius: '15px',
              }}
              allow="microphone *;camera *;midi *;encrypted-media *;clipboard-read;clipboard-write;"
            ></iframe>
          ) : loading ? (
            <p>Loading KYC form...</p>
          ) : (
            <p>Unable to load the KYC form. Please try again.</p>
          )}
        </div>
      </div>
      {isReminderPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3>Complete Your Profile</h3>
            <p>
              To continue with the KYC process, please complete your investor profile.
            </p>
            <p>
              You will be able to return to this at a later date, but your profile will need to be completed before investing with XDRIP Digital Management.
            </p>
            <div className={styles.popupButtons}>
              <Button
                btnName="Create Profile"
                onClick={handleProfileRedirect}
                fontSize="inherit"
              />
              <Button
                btnName="Later"
                onClick={() => setIsReminderPopupVisible(false)}
                fontSize="inherit"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
