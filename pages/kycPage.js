import React, { useState, useEffect } from 'react';
import snsWebSdk from '@sumsub/websdk';
import styles from '../styles/KYCPage.module.css';
import { Button, InvestorProfileModal } from "../components/componentsindex";
import { useRouter } from 'next/router';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const KYCPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kycStarted, setKycStarted] = useState(false);
  const [isReminderPopupVisible, setIsReminderPopupVisible] = useState(false); // Popup state
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    console.log("Router Object:", router); // Logs the entire router object
    if (router.isReady) {
      setQueryParams(router.query);
      console.log("Router Query Parameters:", router.query); // Logs the query parameters
    }
  }, [router.isReady, router.query]);

  const { address, name, email, phoneNumber, kycStatus } = queryParams;

  useEffect(() => {
    if (name && email) {
      setUserInfo({
        name,
        email,
        phoneNumber: phoneNumber || '',
        kycStatus: kycStatus || 'not_started',
      });
    }
  }, [name, email, phoneNumber, kycStatus]);

  const fetchAccessToken = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-sumsub-token');
      if (!response.ok) throw new Error(`Failed to fetch access token. Status: ${response.status}`);
      const data = await response.json();
      setAccessToken(data.token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeKYCWidget = () => {
    if (accessToken) {
      snsWebSdk
        .init(accessToken, () => fetch('/api/get-sumsub-token').then((res) => res.json()).then((data) => data.token))
        .withConf({ lang: 'en' })
        .on('onError', (error) => console.error('WebSDK Error:', error))
        .onMessage((type, payload) => console.log('WebSDK Message:', type, payload))
        .build()
        .launch('#sumsub-websdk-container');
    }
  };

  const handleBeginKYC = () => {
    if (!address) {
      toast.info("Please connect your wallet to proceed.");
      return;
    }
    if (!userInfo) {
      setIsReminderPopupVisible(true);
      return;
    }
    setKycStarted(true);
    if (!accessToken) {
      fetchAccessToken();
    }
  };

  const handleProfileRedirect = () => {
    if (address) {
      router.push({
        pathname: '/InvestorProfile',
        query: { address },
      });
    } else {
      toast.error("No wallet address found. Please connect your wallet.");
    }
  };
  

  useEffect(() => {
    if (accessToken && kycStarted) {
      initializeKYCWidget();
    }
  }, [accessToken, kycStarted]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <h1 className={styles.title}>Sumsub KYC Verification</h1>
          <div className={styles.walkthrough_wrapper}>
            <section className={styles.walkthrough}>
              <p>
                At <strong>XDRIP Digital Management</strong>, your privacy and security are our top priorities. We use Sumsub's
                advanced KYC (Know Your Customer) solution to provide a secure, user-friendly identity verification process.
              </p>
              <h2>What is KYC and Why Is It Important?</h2>
              <ul>
                <li>
                  <strong>Identity Verification:</strong> KYC helps us ensure the authenticity of users and protects against fraud.
                </li>
                <li>
                  <strong>Regulatory Compliance:</strong> Completing KYC ensures we comply with global financial regulations.
                </li>
                <li>
                  <strong>Access to Exclusive Features:</strong> KYC is mandatory for certain features, such as acquiring the "Eternal Medal."
                </li>
                <li>
                  <strong>Enhanced Account Security:</strong> Verified users benefit from an additional layer of protection for their accounts and transactions.
                </li>
              </ul>
              <h2>How Does the KYC Process Work?</h2>
              <ol>
                <li>
                  Click <strong>"Begin Your KYC Submission"</strong> below to start the process.
                </li>
                <li>
                  Provide your personal details (e.g., name, date of birth) and upload your government-issued ID.
                </li>
                <li>
                  Follow the instructions to take a selfie for identity verification.
                </li>
                <li>
                  Sumsub will process your data securely, and you’ll receive updates on your application via email.
                </li>
              </ol>
              <h2>Privacy and Data Security</h2>
              <p>
                Sumsub adheres to strict data protection standards. Your information will be used solely for verification purposes and kept private
                in accordance with GDPR and other global privacy regulations.
              </p>
            </section>
            <div className={styles.button_wrapper}>
              <Button
                btnName="Return To The Forge"
                onClick={() => router.push('/theForgePage')}
                className={styles.kycButton}
                fontSize="inherit"
              />
            </div>
          </div>
        </div>

        <div className={styles.verticalLine}></div>

        <div className={styles.right}>
          {!kycStarted ? (
            <Button
              btnName="Begin Your KYC Submission"
              onClick={handleBeginKYC}
              className={styles.kycButton}
              fontSize="inherit"
            />
          ) : loading ? (
            <p>Loading KYC widget...</p>
          ) : (
            <div
              id="sumsub-websdk-container"
              style={{
                width: '100%',
                maxWidth: '800px',
                minHeight: '600px',
                margin: '0 auto',
              }}
            ></div>
          )}
        </div>
      </div>

      {/* Reminder Popup */}
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
