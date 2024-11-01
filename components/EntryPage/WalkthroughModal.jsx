import React, { useState, useEffect } from 'react';
import styles from './WalkthroughModal.module.css';
import { Button } from '../componentsindex'; // Assuming Button is imported from componentsindex

const WalkthroughModal = ({ isOpen, onRequestClose }) => {
    const [step, setStep] = useState(1);
    const [hasWallet, setHasWallet] = useState(null);

    // Reset modal state when it is closed
    useEffect(() => {
        if (!isOpen) {
            setStep(1);         // Reset step to 1
            setHasWallet(null); // Reset wallet decision
        }
    }, [isOpen]); // This effect runs whenever isOpen changes

    if (!isOpen) return null; // Render nothing if modal is not open

    // Steps for wallet users
    const walletUserSteps = [
        'Step 1: Click the "OPEN THE VAULT" button. This will prompt your wallet provider (e.g., MetaMask, WalletConnect) to connect to the site.',
        'Step 2: Approve the connection request in your wallet. You will receive a notification in your wallet asking for permission to connect to THE FORGE. Approve this request to continue.',
        'Step 3: View your wallet balance. Once connected, your wallet balance will be displayed. Ensure you have sufficient funds for the forging process.',
        'Step 4: Start forging DOTs by clicking the "FORGE" button, and the forging process will begin.',
        'Step 5: Approve the transaction in your wallet. Confirm the forging transaction, including gas fees, in your wallet, and wait for the transaction to process.',
        'Step 6: View your forged DOTs in the "Your Medals Display Case" or directly in your connected wallet once the transaction is successful.'
    ];

    // Steps for new users
    const newUserSteps = [
        'Step 1: Click the "OPEN THE VAULT" button. This will guide you through the process of setting up a new wallet using Thirdweb\'s simple onboarding.',
        'Step 2: Enter your email address or sign in with social login. Thirdweb will generate a new wallet for you without the need for external apps.',
        'Step 3: Save your recovery phrase. This is the most important step to secure your wallet. Your recovery phrase allows you to recover your wallet if needed.',
        'Step 4: Add funds to your wallet if necessary. Use crypto or available on-ramp services to fund your wallet before forging DOTs.',
        'Step 5: Start forging DOTs by clicking the "FORGE" button, and the forging process will begin.',
        'Step 6: Approve the transaction in your wallet. Confirm the forging transaction, including gas fees, in your wallet, and wait for the transaction to process.',
        'Step 7: View your forged DOTs in the "Your Medals Display Case" or directly in your connected wallet once the transaction is successful.'
    ];

    const renderSteps = () => {
        if (hasWallet === null) {
            return (
                <>
                    <h3 className={styles.stepsText}>Do you already have a DeFi wallet?</h3>
                    <div className={styles.buttonContainer}>
                    <Button
                        btnName="Yes, I have a wallet"
                        onClick={() => setHasWallet(true)}
                        fontSize="inherit"
                        paddingLeft="0"
                        paddingRight="0"
                        isActive={false}
                    />
                    <Button
                        btnName="No, I need a wallet"
                        onClick={() => setHasWallet(false)}
                        fontSize="inherit"
                        paddingLeft="0"
                        paddingRight="0"
                        isActive={false}
                    />
                    </div>
                </>
            );
        }

        const steps = hasWallet ? walletUserSteps : newUserSteps;

        return (
            <>
                <h2>{hasWallet ? "Wallet User Walkthrough" : "New User Walkthrough"}</h2>
                <p className={styles.stepsText}>{steps[step - 1]}</p>
                <div className={styles.buttonContainer}>
                    {step > 1 && (
                        <Button
                            btnName="Back"
                            onClick={() => setStep(step - 1)}
                            fontSize="inherit"
                            paddingLeft="0"
                            paddingRight="0"
                            isActive={false}
                        />
                    )}
                    {step < steps.length && (
                        <Button
                            btnName="Next"
                            onClick={() => setStep(step + 1)}
                            fontSize="inherit"
                            paddingLeft="0"
                            paddingRight="0"
                            isActive={false}
                        />
                    )}
                    {step === steps.length && (
                        <Button
                            btnName="Close Walkthrough"
                            onClick={onRequestClose}
                            fontSize="inherit"
                            paddingLeft="0"
                            paddingRight="0"
                            isActive={false}
                        />
                    )}
                </div>
            </>
        );
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
            <div className={styles.close_buttonContainer}>
                <Button
                    btnName="X"
                    onClick={onRequestClose}
                    className={styles.closeButton}
                    fontSize="10px"
                    paddingLeft="0"
                    paddingRight="0"
                    isActive={false}
                />
                 </div>
                {renderSteps()}          
            </div>
        </div>
    );
};

export default WalkthroughModal;