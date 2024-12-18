import React, { useState, useEffect, useMemo } from 'react';
import styles from './WalkthroughModal.module.css';
import { Button } from '../componentsindex';
import Modal from "react-modal";

const WalkthroughModal = ({ isOpen, onRequestClose, isEternalTier = false }) => {
    const [step, setStep] = useState(1);
    const [hasWallet, setHasWallet] = useState(null);
    const [profileCreated, setProfileCreated] = useState(false);
    const [kycCompleted, setKycCompleted] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setHasWallet(null);
            setProfileCreated(false);
            setKycCompleted(false);
        }
    }, [isOpen]);

    const walletUserSteps = useMemo(() => [
        'Step 1: Connect your wallet by clicking the "OPEN THE VAULT" button. This will prompt your wallet provider (e.g., MetaMask) to request a connection.',
        'Step 2: Approve the connection request in your wallet.',
        'Step 3: Verify your wallet connection and ensure you are on the correct blockchain network (e.g., Binance Smart Chain).',
        'Step 4: Create your investor profile to track purchases and streamline the onboarding process. Fill in the required details and save your profile.',
        'Step 5: Complete the KYC verification process (mandatory for purchasing Eternal tier). This step validates your identity and ensures regulatory compliance.',
        'Step 6: Proceed to purchase your D.O.Ts by clicking "FORGE."',
    ], []);
    
    const newUserSteps = useMemo(() => [
        'Step 1: Choose your preferred wallet creation method.',
        'Option 1: Download and set up MetaMask. Go to metamask.io, download the browser extension or mobile app, and follow the prompts to create your wallet. Make sure to securely save your recovery phrase.',
        'Option 2: Create a wallet through Thirdweb. Use your email address or social login to quickly set up a wallet. A JSON file will be generated containing the necessary data for importing your wallet and will prompt you to save it to your local machine.',
        'Step 2: If you decide on using Thirdweb, we highly recommend importing your created local wallet information to MetaMask for better accessibility and security. To do this, open MetaMask, select "Import Wallet," and upload the JSON file provided during the Thirdweb wallet creation process.',
        'Step 3: Add funds to your wallet. Use the integrated on-ramp services or transfer funds from an existing wallet.',
        ...walletUserSteps.slice(3), // Reuse steps for wallet users from step 4 onward
    ], []);
    

    const steps = hasWallet ? walletUserSteps : newUserSteps;

    const handleKycProcess = () => {
        // Mock KYC completion logic
        setKycCompleted(true);
        alert('KYC process completed successfully!');
    };
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
                        } else if (!hasWallet) {
                            if (step === 1) return "Wallet Setup Options";
                            if (step === 2) return "Setting Up Your Wallet";
                            if (step === 3) return "Continuing With ThirdWeb";
                            if (step === 4) return "Upload Local Wallet To Metamask";
                            if (step === 5) return "Funding Your Wallet";
                            if (step === 6) return "Creating Your Profile";
                            if (step === 7) return "Completing KYC (Optional)";
                            if (step === 8) return "Continue To The Forge";
                        } else if (hasWallet) {
                            if (step === 1) return "Connecting Your Wallet";
                            if (step === 2) return "Approving Connection";
                            if (step === 3) return "Always Verify";
                            if (step === 4) return "Creating Your Profile";
                            if (step === 5) return "KYC (Optional)";
                            if (step === 6) return "Continue To The Forge";
                        }
                        return `Purchasing Step ${step}`; 
                    })()}
                </h2>

                <div className={styles.stepCard}>

                    <p className={styles.stepDescription}>
                        {steps[step - 1].split(":").slice(1).join(":").trim()}
                    </p>
                    {step === 2 && !hasWallet && (
                        <div className={styles.optionsLayout}>
                            <div className={styles.optionSection}>
                                <h4>Option 1: MetaMask</h4>
                                <p>Download MetaMask from <a href="https://metamask.io" target="_blank" rel="noreferrer">MetaMask.io</a> and follow their step-by-step guide to create a wallet.</p>
                            </div>
                            <div className={styles.optionSection}>
                                <h4>Option 2: Thirdweb Local Wallet</h4>
                                <p>Create a wallet instantly using your email or social login. A recovery file (JSON) will be provided to import into MetaMask later.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.buttonContainer}>
                    {step === 1 ? (
                        <Button
                            btnName="Back to Wallet Options"
                            onClick={() => setHasWallet(null)}
                            fontSize="inherit"
                            className={styles.actionButton}
                        />
                    ) : (
                        <Button
                            btnName="Back"
                            onClick={() => setStep(step - 1)}
                            fontSize="inherit"
                            className={styles.actionButton}
                        />
                    )}
                    {step < steps.length && (
                        <Button
                            btnName="Next"
                            fontSize="inherit"
                            onClick={() => setStep(step + 1)}
                            className={styles.actionButton}
                        />
                    )}
                    {step === steps.length && (
                        <Button
                            btnName="Finish Walkthrough"
                            fontSize="inherit"
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
