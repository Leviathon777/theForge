import React, { useState, useEffect, useRef, memo, forwardRef, useContext } from "react";
import { motion } from "framer-motion";
import DotWallet from "../components/DotWallets/DotWallet";
import { Button, SocialButtons, ForgeComponent, TermsOfService, UserAgreement, FlipBook, EmailFormPopup } from "../components/componentsindex";
import MyDotData from "../Context/MyDotDataContext";
import Style from "../styles/theForge.module.css";
import { useSigner, useAddress } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { usePayload } from "../Context/PayloadContext";

const PwaInstructionsModal = ({ onClose }) => (
  <div className={Style.modalOverlay}>
    <div className={Style.modalContent}>
      <div className={Style.modalText}>
        <h2>Installing MOH As A PWA</h2>
        <p>Enhance your mobile experience by installing our site as a Progressive Web App.</p>
        <div className={Style.modalDevice}>
          <h3>For Android Devices</h3>
          <ol>
            <li>Launch your browser (e.g., Google Chrome, Firefox) and navigate to our website.</li>
            <li>Tap the three-dot menu icon (usually in the top-right corner).</li>
            <li>Select "Add to Home Screen" or "Install App."</li>
            <li>Tap "Add" or "Install" to confirm.</li>
            <li>The app will now appear on your home screen. Tap it to open it like a regular app.</li>
          </ol>
        </div>
        <div className={Style.modalDevice}>
          <h3>For iOS Devices (iPhone/iPad)</h3>
          <ol>
            <li>Launch Safari and navigate to our website.</li>
            <li>Tap the "Share" button (square with an upward arrow at the bottom of the screen).</li>
            <li>Scroll down and tap "Add to Home Screen."</li>
            <li>Customize the name if desired, then tap "Add" in the top-right corner.</li>
            <li>The app icon will appear on your home screen. Tap it to open and use the app.</li>
          </ol>
        </div>
        <button className={Style.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);

const TheForge = () => {
  const [bnbPrice, setBnbPrice] = useState(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const signer = useSigner();
  const address = useAddress();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const { setActivatePayload } = usePayload();
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);

  useEffect(() => {
    setActivatePayload(true);
    return () => setActivatePayload(false);
  }, [setActivatePayload]);

  useEffect(() => {
    const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
  }, []);

  useEffect(() => {
    const fetchBNBPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
        const data = await response.json();
        setBnbPrice(data.binancecoin.usd);
      } catch (error) {
        console.error("Failed to fetch BNB price:", error);
      }
    };
    fetchBNBPrice();
  }, []);

  useEffect(() => {
    const checkOwner = async () => {
      if (!signer || !address) return;
      try {
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_MEDAL_CONTRACT_ADDRESS,
          require('../Context/mohCA_ABI.json').abi,
          signer
        );
        const contractOwner = await contract.owner();
        const authorizedAddresses = process.env.NEXT_PUBLIC_OWNER_ADDRESSES?.split(",").map(addr => addr.trim().toLowerCase()) || [];

        if (
          address.toLowerCase() === contractOwner.toLowerCase() ||
          authorizedAddresses.includes(address.toLowerCase())
        ) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (error) {
        console.error("Error checking owner:", error);
      }
    };
    if (signer && address) {
      checkOwner();
    }
  }, [signer, address]);

  const handleNavigation = () => {
    router.push('/Xecutives').catch(err => console.error("Navigation error:", err));
  };
  const handleDocNavigation = () => {
    router.push('/SiteFlow').catch(err => console.error("Navigation error:", err));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className={Style.theForge}
      style={{
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <div className={Style.theForge_content}>
        {isMobile && (
          <button
            className={Style.pwaButton}
            onClick={() => setIsPwaModalOpen(true)}
          >
            How To Install PWA
          </button>
        )}

        {isPwaModalOpen && (
          <PwaInstructionsModal onClose={() => setIsPwaModalOpen(false)} />
        )}
        <div className={Style.first_component}>
          <h1>THE FORGE OF DESTINY</h1>
        </div>
        <div className={Style.theLoreContent}>
          <h1 className={Style.component_title_text}>A LEGENDS LORE</h1>
          <p className={Style.loreText}>
            In the mythical land of Xdripia, a beacon of courage and relentless perseverance stands above all else:
            <strong> The Forge of Destiny</strong>. This revered place, shrouded in mystery, is the ultimate arena
            where only the most steadfast and fearless warriors dare to tread. Here, champions face brutal trials,
            their mettle tested against both the elements and the fierce legacy of those who came before. This journey
            is not simply for glory but is a proving ground for the heart, strength, and unwavering loyalty to the
            people of Xdripia.
            <br />
            <br />
            Nestled within the unforgiving, jagged peaks of the IronForge Mountains, The Forge of Destiny remains
            hidden from those not called by destiny. The journey alone is the first trial—an arduous trek through
            treacherous ravines and chilling winds designed to strip away any pretenders. Only those with resilience
            in their hearts and fire in their spirits will emerge at the gates of the Forge, ready to face the
            ordeals within.
            <br />
            <br />
            The warriors who make it to the Forge are tasked with surviving a series of increasingly formidable
            challenges. Each test pushes them to the edge of their abilities, testing not only their strength but
            their courage, wisdom, and loyalty. These trials are set by the ancient guardians of Xdripia, remnants
            of an era when the land faced its greatest perils, including betrayal from within.
            <br />
            <br />
            In these dark times, Xdripia has seen betrayal from allies, sabotage from within, and the relentless
            assault of the Caller Syndicate—a ruthless coalition of traitors who seek to tear apart the unity of
            Xdripia. The Syndicate's attacks have left scars on both the land and its people. But with every strike
            from the enemy, the Forge produces a new champion, a beacon of hope to rally the people.
            <br />
            <br />
            For the few who emerge victorious from this sacred place, they earn more than glory—they earn the right
            to forge the <strong>Medal of Honor</strong>. This medal is a sacred symbol, imbued with the memories
            of battles fought, and a promise to guard Xdripia against all foes, external and internal. Each medal
            represents not just a battle but a personal sacrifice and the resilience of those who fight for the
            freedom of Xdripia. Its existence binds the warrior to the ancient duty of defending their homeland,
            marking them among the most uncommon, rare, epic, and legendary heroes in history.
          </p>
        </div>
        <div className={Style.glowingDivider}></div>
        <MyDotData>
          <div className={Style.second_component}>
            <ForgeComponent setIsModalOpen={setIsModalOpen} bnbPrice={bnbPrice} />
          </div>
          <div className={Style.glowingDivider}></div>
          <div className={Style.third_component}>
            <h1 className={Style.component_title_text}>MEDALS OF HONOR WALLET</h1>
            <DotWallet address={address} />
          </div>
          <div className={Style.glowingDivider}></div>
          <div className={Style.fourth_component}>
            <h1 className={Style.component_title_text}>MEDALS OF HONOR BENEFITS</h1>
            <FlipBook />
          </div>

          <div className={Style.glowingDivider}></div>
          <div className={Style.fifth_component}>
            <SocialButtons />
            <div className={Style.button_botton_box}>
              <Button
                btnName="Terms of Service"
                onClick={() => setIsTermsModalOpen(true)}
                fontSize="inherit"
                paddingLeft="0"
                paddingRight="0"
                isActive={false}
                setIsActive={() => { }}
                title="Terms of Service"
              />
              <Button
                btnName="Contact Us"
                onClick={() => setIsEmailFormOpen(true)}
                fontSize="inherit"
                paddingLeft="0"
                paddingRight="0"
                isActive={false}
                setIsActive={() => { }}
                title="Contact Us"
              />
              <Button
                btnName="User Agreement"
                onClick={() => setIsUserAgreementModalOpen(true)}
                fontSize="inherit"
                paddingLeft="0"
                paddingRight="0"
                isActive={false}
                setIsActive={() => { }}
                title="User Agreement"
              />
              {isOwner && (
                <Button
                  btnName="Owner Operations"
                  onClick={handleNavigation}
                  fontSize="inherit"
                  paddingLeft=".5rem"
                  paddingRight=".5rem"
                  isActive={false}
                  setIsActive={() => { }}
                  title="Go to OwnerOps"
                />
              )}
            </div>
            <TermsOfService
              isOpen={isTermsModalOpen}
              onRequestClose={() => setIsTermsModalOpen(false)}
            />
            <UserAgreement
              isOpen={isUserAgreementModalOpen}
              onRequestClose={() => setIsUserAgreementModalOpen(false)}
            />
            {isEmailFormOpen && (
              <EmailFormPopup
                isVisible={isEmailFormOpen}
                onClose={() => setIsEmailFormOpen(false)}
              />
            )}
          </div>
        </MyDotData>
      </div >
    </motion.div>
  );
};
export default TheForge;
