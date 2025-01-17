import React, { useEffect, useState, useCallback } from "react";
import {
  ThirdwebProvider,
  inAppWallet,
  metamaskWallet,
  trustWallet,
  walletConnect,
  localWallet,
  useAddress,
  useSigner,
  useDisconnect,
} from "@thirdweb-dev/react";
import Head from "next/head";
import Cookies from "js-cookie";
import { MOHProvider } from "../Context/MOHProviderContext";
import "../styles/globals.css";
import { CookieManager, MobileModal, Button } from "../components/componentsindex";
import { ChainId } from "@thirdweb-dev/sdk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Style from "../styles/app.module.css";
import { PayloadProvider } from "../Context/PayloadContext";
import { usePayload } from "../Context/PayloadContext";

const AuthHandler = () => {
  const { activatePayload } = usePayload();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [mohvat, setMohvat] = useState("");
  const address = useAddress();
  const signer = useSigner();
  const disconnectWallet = useDisconnect();

  const generateGenericPayloadMessage = (userAddress) => {
    if (!userAddress) {
      throw new Error("Wallet address is required to generate the generic payload message");
    }
    const nonce = Math.floor(Math.random() * 1000000);
    const issuedAt = new Date().toISOString();
    const expirationTime = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();

    return `*** AUTHORIZATION REQUEST ***
MEDALS OF HONOR DIGITAL OWNERSHIP TOKEN (DOT) COLLECTION

By proceeding, you authorize this request for a Vault Access Token (VAT). This token is required for secure authenticated access to the Medals of Honor platform.

ACCOUNT & AUTHORIZATION INFORMATION:
- Physical Blockchain Location: ${userAddress}
- Version: MOH-Beta-v1.01124
- Unique Nonce: ${nonce}, issued at: ${issuedAt}, valid until: ${expirationTime}

IMPORTANT NOTICE:
1. By signing this message, you confirm your intent to authenticate your account for access to the Medals of Honor platform.
2. This authorization is valid only for the duration specified in the Expiration Time above.
3. Signing this message does NOT grant access to your wallet’s funds or other permissions unrelated to authentication.

DISCLAIMER:
This message is generated exclusively for Medals of Honor platform authentication. If you did not initiate this request, do not sign this message. Unauthorized use of this signature may result in account restrictions.

TERMS OF SERVICE:
By signing this message, you agree to our Terms of Service. For more details, visit https://www.xdrip.io/terms

SUPPORT:
For support or assistance, contact our team at support@xdrip.io
`;
  };
  const handleGenericPayloadPopup = (userAddress) => {
    const message = generateGenericPayloadMessage(userAddress);
    setPopupContent(
      <div className={Style.modalOverlay}>
        <div className={Style.modalContent}>
          <div style={{ whiteSpace: "pre-line", textAlign: "left", padding: "10px" }}>
            <p className={Style.popupText}>{message}</p>
            <div className={Style.modalButtons}>
              <Button
                btnName="Accept"
                onClick={handleAccept}
                onTouchStart={(e) => e.preventDefault() || handleAccept()}
                className={Style.signatureButton}
                fontSize="1rem"
                paddingTop=".5rem"
                paddingRight="1rem"
                paddingBottom=".5rem"
                paddingLeft="1rem"
                background="rgba(0, 255, 0, 0.5)"
              />
              <Button
                btnName="Decline"
                onClick={handleDecline}
                onTouchStart={(e) => e.preventDefault() || handleDecline()}
                className={Style.signatureButton}
                fontSize="1rem"
                paddingTop=".5rem"
                paddingRight="1rem"
                paddingBottom=".5rem"
                paddingLeft="1rem"
                background="rgba(255, 0, 0, 0.5)"
              />
            </div>
          </div>
        </div>
      </div>
    );
    setIsPopupVisible(true);
  };

  const handleAccept = async () => {
    if (signer && address) {
      const payload = generateGenericPayloadMessage(address);
      const signature = await signer.signMessage(payload);
      const expirationTime = Date.now() + 4 * 60 * 60 * 1000;
      localStorage.setItem(
        "mohvat",
        JSON.stringify({ address, signature, payload, expirationTime })
      );
      setIsPopupVisible(false);
    }
  };

  const handleDecline = () => {
    setIsPopupVisible(false);
    disconnectWallet();
  };

  useEffect(() => {
    if (activatePayload && address && signer) {
      const storedVAT = JSON.parse(localStorage.getItem("mohvat"));
      if (storedVAT && storedVAT.address === address) {
        if (Date.now() < storedVAT.expirationTime) return;
      }
      handleGenericPayloadPopup(address);
    }
  }, [activatePayload, address, signer]);


  return (
    <>
      {isPopupVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              color: "white",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {popupContent}
          </div>
        </div>
      )}

    </>
  );
};
const MyApp = ({ Component, pageProps }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCookieModalVisible, setIsCookieModalVisible] = useState(false);
  const [splashVideo, setSplashVideo] = useState("/videos/splash.mp4");
  const [hasEntered, setHasEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPwaModalVisible, setIsPwaModalVisible] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const detectMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSplashVideo(mobile ? "/videos/splashmobile.mp4" : "/videos/splashpc.mp4");
    };
    detectMobile();
    window.addEventListener("resize", detectMobile);
    return () => window.removeEventListener("resize", detectMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (isMobile) {
        setIsPwaModalVisible(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  const handleDismissPwaModal = () => {
    setIsPwaModalVisible(false);
  };

  useEffect(() => {
    if (!isLoading && !Cookies.get("acceptedCookies")) {
      setIsCookieModalVisible(true);
    }
  }, [isLoading]);

  const saveCookies = (accepted, preferences) => {
    Cookies.set("cookiesAccepted", accepted ? "true" : "false", { expires: 30, path: "/" });
    Cookies.set("cookiePreferences", JSON.stringify(preferences), { expires: 30, path: "/" });
  };

  const handleAcceptCookies = () => {
    saveCookies(true, cookiePreferences);
    setIsCookieModalVisible(false);
  };

  const handleDeclineCookies = () => {
    saveCookies(false, { essential: true });
    setCookiePreferences({ essential: true });
    setIsCookieModalVisible(false);
  };

  const updatePreferences = (key, value) => {
    const updatedPreferences = { ...cookiePreferences, [key]: value };
    setCookiePreferences(updatedPreferences);
    Cookies.set("cookiePreferences", JSON.stringify(updatedPreferences), { expires: 30 });
  };

  useEffect(() => {
    const cookiesAccepted = Cookies.get("cookiesAccepted");
    if (!cookiesAccepted) {
      setIsCookieModalVisible(true);
    } else {
      setCookiePreferences(JSON.parse(Cookies.get("cookiePreferences") || "{}"));
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Medals of HONOR by XdRiP</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta
          name="description"
          content="The Medals of Honor Collection by XdRiP Digital Management, LLC"
        />
      </Head>

      {isPwaModalVisible && isMobile ? (
        <MobileModal onDismiss={handleDismissPwaModal} />
      ) : isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <video
            src={splashVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      ) : (
        <PayloadProvider>
          <ThirdwebProvider
            activeChain={ChainId.BinanceSmartChainTestnet}
            clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
            //autoConnect={false}
            modalConfig={{
              disableBuyButton: true,
            }}
            supportedWallets={[
              inAppWallet(),
              metamaskWallet({ recommended: true }),
              trustWallet(),
              walletConnect(),
              localWallet(),

            ]}
          >
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={true}
              closeOnClick={true}
              pauseOnHover={true}
              draggable={false}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
                maxWidth: "600px",
                width: "auto",
              }}
              toastStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "16px",
                boxShadow: "0 8px 15px rgba(0, 0, 0, 0.5)",
                padding: "20px",
                color: "#ffffff",
                fontFamily: "'Saira', sans-serif",
                textAlign: "center",
                backdropFilter: "blur(8px)",
              }}
            />
            <AuthHandler />
            <MOHProvider>
              {isCookieModalVisible && (
                <CookieManager
                  preferences={cookiePreferences}
                  updatePreferences={updatePreferences}
                  handleAcceptCookies={handleAcceptCookies}
                  handleDeclineCookies={handleDeclineCookies}
                />
              )}
              <Component
                {...pageProps}
              />
            </MOHProvider>
          </ThirdwebProvider>
        </PayloadProvider>
      )}
    </>
  );
};
export default MyApp;
