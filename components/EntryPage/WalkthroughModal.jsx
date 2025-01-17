import React, { useState, useEffect, useMemo } from 'react';
import styles from './WalkthroughModal.module.css';
import { Button } from '../componentsindex';
import Modal from "react-modal";

const WalkthroughModal = ({ isOpen, onRequestClose = false }) => {
    const [step, setStep] = useState(1);
    const [hasWallet, setHasWallet] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setHasWallet(null);
        }
    }, [isOpen]);

    const walletUserSteps = useMemo(() => [
        'Step 1: Connect your wallet by clicking on the "CONNECT WALLET" button. This will open the wallet selection modal. Here you can select your wallet provider (e.g., MetaMask), or choose another web3 wallet creation method. The request sent to your wallet will connect to THE FORGE, allowing you to continue your investment path.',
        'Step 2: A window will open prompting you to approve this connection, as well as an approval request for the connection utilizing the Medals Of Honor Vault Access Token. This token allows continued access without these prompts for a period of 24 hours (1 day).',
        'Step 3: Once your wallet is connected to THE FORGE, we suggest you verify your wallet connection to the correct blockchain network (Binance Smart Chain).',
        'Step 4: If you are a new investor to THE FORGE, you will be prompted to create your investor profile. This allows XDRIP Digital Management to track, secure, and properly document purchases, streamlining the investing process. Fill in the required details and save your profile.',
        'Step 5: After completing your investor profile, you will then be prompted to complete the KYC verification process. The KYC process can also be found in the dropdown VAULT ACTIONS in the FORGE area. This process is not yet mandatory to begin the investing process but is required for investing as an ETERNAL. This step validates your identity and ensures regulatory compliance across the globe. It is an important step that provides a deeper level of security and compliance.',
        'Step 6: If you have proceeded with the KYC process, please allow the allotted time for KYCAID (our KYC provider) to complete and approve your KYC before attempting to invest as an ETERNAL.',
        'Step 7: Once your investor profile is complete and you are ready to invest via THE FORGE platform, your next step will be ensuring you have the proper funds to complete your investment.',
        'Step 8: First, verify the MEDAL OF HONOR tier you are targeting to forge. Ensure you have the necessary BNB to invest in that medal tier. If you do not, there are a few options available.',
        'Step 9: You may transfer funds from a CEX like Coinbase or Binance. Alternatively, you can on-ramp fiat to crypto directly on THE FORGE via TRANSAK on and off-ramp solutions.',
        'Step 10: TRANSAK allows you to purchase crypto directly through your bank account, credit card, debit card, or other options that may be available in your region. Note that TRANSAK will require a KYC process to use their services. To expedite the process, we have incorporated the same KYC group used by TRANSAK, enabling cross-platform acceptance of the KYC to eliminate multiple application points.',
        'Step 11: Once you have funded your wallet with the proper amount of BNB, you can then return to THE FORGE and begin the investing process with XDRIP Digital Management. Inside The Forge you choose the tier of MEDAL OF HONOR you are forging. Follow the wallet prompts to finalize your investment.',
        'Step 12: Once your investment has been finalized you will receive an email with a receipt and welcome letter. You now will be able to view your MEDALS OF HONOR inside THE FORGE and view the benefits that accompany your investment.',
    ], []);

    const newUserSteps = useMemo(() => [
        'Step 1: There are many options available to create a new wallet, or begin your journey with self-custody digital wallets. We are here to simplify and streamline this process.',
        'Step 2: We recommend MetaMask. Their extension is available for popular browsers, as well as their mobile app. Your PC will provide the best experience (highly suggested). Click CONNECT WALLET, then "Connect a Wallet", choose Metamask and follow the on screen prompts. In your browser simply navigate to metamask.io and install. On mobile, metamask is available in app stores. After installation, create a new wallet. Make sure to securely save your recovery phrase in a safe location accessible only to you. This is your access number to your bank account on the blockchain. ',
        'Step 3: Alternatively, you can create a local wallet using email, google, etc. An anonymous option is available by selecting "Guest Wallet" however, we do not recommend this for long-term use. Inside The MOH wallet options, select Connect a Wallet, email, phone number, facebook, apple, google, or Continue as guest. For guess wallets, a secure JSON file is generated, maintaining the necessary data for importing your wallet. You will be reminded often to obtain a web3 wallet.',
        'Step 4: If you do choose to connect anonymously (guest wallet), we highly recommend importing the wallet to MetaMask at your earliest convenience. This ensures safe ongoing accessibility and security. To do this, while connected as guest, open wallet connection and choose backup wallet, then download the JSON file. Next, open MetaMask, select "Import Wallet", upload the JSON file provided during the guest wallet backup process.',
        'Step 5: A window will open prompting you to approve this connection, as well as a request to approve the connection utilizing THE MEDAL OF HONOR Vault Access Token. This token allows continued access without these prompts for a period of 24 hours (1 day).',
        'Step 6: Once your wallet is connected to THE FORGE, we suggest you verify your wallet connection to the correct blockchain network (Binance Smart Chain).',
        'Step 7: If you are a new investor to THE FORGE, you will be prompted to create your investor profile. This allows XDRIP Digital Management to track, secure, and properly document purchases, streamlining the investing process. Fill in the required details and save your profile.',
        'Step 8: After completing your investor profile, you will then be prompted to complete the KYC verification process. The KYC process can also be found in the dropdown VAULT ACTIONS in the FORGE area. This process is not yet mandatory to begin the investing process but is required for investing as an ETERNAL. This step validates your identity and ensures regulatory compliance across the globe. It is an important step that provides a deeper level of security and compliance.',
        'Step 9: If you chose to proceed with the KYC process, please allow the allotted time for KYCAID (our KYC provider) to complete and approve your KYC before attempting to invest as an ETERNAL.',
        'Step 10: Once your investor profile is complete and you are ready to invest via THE FORGE platform, your next step will be ensuring you have the proper funds to complete your investment.',
        'Step 11: First, verify the MEDAL OF HONOR tier you are targeting to forge. Ensure you have the necessary BNB to invest in that medal tier. If you do not, there are a few options available.',
        'Step 12: You may transfer funds from a CEX like Coinbase or Binance. Alternatively, you can on-ramp fiat to crypto directly on THE FORGE via TRANSAK on and off-ramp solutions.',
        'Step 13: TRANSAK allows you to purchase crypto directly through your bank account, credit card, debit card, or other options that may be available in your region. Note that TRANSAK will require a KYC process to use their services. To expedite the process, we have incorporated the same KYC group used by TRANSAK, enabling cross-platform acceptance of the KYC to eliminate multiple application points.',
        'Step 14: Once you have funded your wallet with the proper amount of BNB, you can then return to THE FORGE and begin the investing process with XDRIP Digital Management. Inside The Forge you choose the tier of MEDAL OF HONOR you are forging. Follow the wallet prompts to finalize your investment.',
        'Step 15: Once your investment has been finalized you will receive an email with a receipt and welcome letter. You now will be able to view your MEDALS OF HONOR inside THE FORGE and view the benefits that accompany your investment',
    ], []);



    const steps = hasWallet ? walletUserSteps : newUserSteps;

    const renderSteps = useMemo(() => {
        if (hasWallet === null) {
            return (
                <>
                    <h2 className={styles.mainTitle}>Get Started with The Forge</h2>
                    <p className={styles.subtitle}>Do you already have a DeFi wallet?</p>
                    <div className={styles.optionsContainer}>
                        <button
                            onClick={() => setHasWallet(true)}
                            className={`${styles.optionCard} ${styles.walletOption}`}
                        >
                            <h3>Yes, I have a Wallet</h3>
                            <p>Connect your existing DeFi wallet (e.g., MetaMask, Trust Wallet).</p>
                        </button>
                        <button
                            onClick={() => setHasWallet(false)}
                            className={`${styles.optionCard} ${styles.walletOption}`}
                        >
                            <h3>No, I Need a Wallet</h3>
                            <p>Set up a wallet quickly using MetaMask or our local wallet solution.</p>
                        </button>
                    </div>
                </>
            );
        }

        return (
            <>
                <h2 className={styles.stepTitle}>
                    {(() => {
                        if (hasWallet === null) {
                            return "Get Started with The Forge";
                        } else if (hasWallet) {
                            switch (step) {
                                case 1: return "Connect Your Wallet";
                                case 2: return "Approve Wallet Connection & V.A.T";
                                case 3: return "Verify Blockchain Network (BSC)";
                                case 4: return "Create Your Investor Profile";
                                case 5: return "Complete KYC Verification (Optional)";
                                case 6: return "Await KYC Approval";
                                case 7: return "Prepare Funds for Investment";
                                case 8: return "Select Medal of Honor Tier";
                                case 9: return "Transfer Funds via CEX or On-Ramp";
                                case 10: return "Purchase Crypto via TRANSAK";
                                case 11: return "Begin Your Investment Path";
                                case 12: return "Viewing Your Investments";
                                default: return `Step ${step}: Unspecified`;
                            }
                        } else if (!hasWallet) {
                            switch (step) {
                                case 1: return "Choose a Wallet Setup Option";
                                case 2: return "Set Up MetaMask Extension or Mobile App";
                                case 3: return "Local, Web3, and Guest Wallets";
                                case 4: return "Import Wallet Data to MetaMask (Optional)";
                                case 5: return "Approve Wallet Connection & VAT";
                                case 6: return "Verify Blockchain Network (BSC)";
                                case 7: return "Create Your Investor Profile";
                                case 8: return "Complete KYC Verification (Optional)";
                                case 9: return "Await KYC Approval";
                                case 10: return "Prepare Funds for Investment";
                                case 11: return "Select Medal of Honor Tier";
                                case 12: return "Transfer Funds via CEX or On-Ramp";
                                case 13: return "Purchase Crypto via TRANSAK";
                                case 14: return "Begin Your Investment Path";
                                case 15: return "Viewing Your Investments";
                                default: return `Step ${step}: Unspecified`;
                            }
                        }
                        return `Purchasing Step ${step}`;
                    })()}
                </h2>

                <div className={styles.stepCard}>
                    <p className={styles.stepDescription}>
                        {steps[step - 1].split(":").slice(1).join(":").trim()}
                    </p>
                </div>

                <div className={styles.buttonContainer}>
                    {step === 1 ? (
                        <Button
                            btnName="Back to Wallet Options"
                            onClick={() => setHasWallet(null)}
                            fontSize="inherit"
                            paddingTop=".5rem"
                            paddingRight="1rem"
                            paddingBottom=".5rem"
                            paddingLeft="1rem"
                            background=""
                            className={styles.actionButton}
                        />
                    ) : (
                        <Button
                            btnName="Back"
                            onClick={() => setStep(step - 1)}
                            fontSize="inherit"
                            paddingTop=".5rem"
                            paddingRight="1rem"
                            paddingBottom=".5rem"
                            paddingLeft="1rem"
                            background=""
                            className={styles.actionButton}
                        />
                    )}
                    {step < steps.length && (
                        <Button
                            btnName="Next"
                            fontSize="inherit"
                            paddingTop=".5rem"
                            paddingRight="1rem"
                            paddingBottom=".5rem"
                            paddingLeft="1rem"
                            background=""
                            onClick={() => setStep(step + 1)}
                            className={styles.actionButton}
                        />
                    )}
                    {step === steps.length && (
                        <Button
                            btnName="Finish Walkthrough"
                            fontSize="inherit"
                            paddingTop=".5rem"
                            paddingRight="1rem"
                            paddingBottom=".5rem"
                            paddingLeft="1rem"
                            background=""
                            onClick={onRequestClose}
                            className={styles.finishButton}
                        />
                    )}
                </div>
            </>
        );
    }, [hasWallet, step, steps, onRequestClose]);



    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
            contentLabel="Walkthrough Modal"
            ariaHideApp={false}
        >
            <div className={styles.close_buttonContainer}>
                <Button
                    btnName="X"
                    onClick={onRequestClose}
                    fontSize="10px"
                    paddingTop=".5rem"
                    paddingRight="1rem"
                    paddingBottom=".5rem"
                    paddingLeft="1rem"
                    background=""
                    className={styles.closeButton}
                    isActive={false}
                />
            </div>
            <div className={styles.closeSteps}>
                {renderSteps}
            </div>
        </Modal>
    );
};

export default React.memo(WalkthroughModal);
