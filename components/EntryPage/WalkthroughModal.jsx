import React, { useState, useEffect, useMemo } from 'react';
import styles from './WalkthroughModal.module.css';
import { Button } from '../componentsindex';
import Modal from "react-modal";

const WalkthroughModal = ({ isOpen, onRequestClose }) => {
    const [step, setStep] = useState(1);
    const [hasWallet, setHasWallet] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setHasWallet(null);
        }
    }, [isOpen]);

    const walletUserSteps = useMemo(() => [
        'Step 1: Click the "OPEN THE VAULT" button. This will initiate a connection prompt from your wallet provider, such as MetaMask or WalletConnect, asking you to authorize a connection with THE FORGE.',

        'Step 2: Approve the connection request in your wallet. Check your wallet app or extension for a notification, typically stating the site’s name and asking for your approval to connect. Confirm the connection to proceed. **Note**: Always double-check the website address to ensure you are connecting to a trusted site to avoid phishing scams.',

        'Step 3: Check your wallet connection and view your balance. Once your wallet is connected, you should see your wallet address displayed on the site, along with your current balance. Make sure your balance is sufficient to cover the forging process, including any necessary gas fees (transaction fees required to complete transactions on the blockchain).',

        'Step 4: Switch networks if necessary. **Important**: Some sites require your wallet to be on a specific blockchain network (e.g., Ethereum Mainnet or Binance Smart Chain). If prompted, follow the instructions to switch to the required network in your wallet. You can verify the network by checking the network name at the top of your wallet app or extension.',

        'Step 5: Click the "FORGE" button to begin the forging process for your DOTs. This will trigger a transaction prompt in your wallet, which requires your approval to proceed. **Tip**: Review all transaction details carefully, including gas fees, to ensure accuracy and avoid excessive fees.',

        'Step 6: Approve the forging transaction in your wallet. Once you click "FORGE," your wallet will open a transaction window. Review the transaction summary, including the forging cost and estimated gas fees. Confirm the transaction in your wallet to initiate the forging process. **Note**: Gas fees fluctuate, and during peak usage, fees may be higher than expected. Ensure your wallet balance covers both the forging amount and gas fees to avoid transaction failures.',

        'Step 7: Wait for the transaction to process. Blockchain transactions may take some time, depending on network congestion. You can track the transaction status within your wallet’s activity feed or through a block explorer link that may appear after submitting the transaction. **Tip**: If the transaction is pending for a long time, avoid resubmitting immediately, as this could increase gas costs unnecessarily. Allow time for the blockchain to confirm it.',

        'Step 8: View your newly forged DOTs. After a successful transaction, your DOTs should appear in "Your Medals Display Case" on the site or directly within your connected wallet. You may need to refresh your wallet or add the specific DOT token if it doesn’t appear automatically. **Tip**: Most wallets have an option to "Add Custom Token" where you can manually add new assets using the token’s contract address if it doesn’t show up immediately.',

        'Step 9: Log out if finished. For security, it’s recommended to disconnect from sites when you’re done. You can disconnect from THE FORGE within your wallet’s settings or by using the "Disconnect" button if available on the site.'
    ], []);


    const newUserSteps = useMemo(() => [
        'Step 1: Click the "OPEN THE VAULT" button. This will start the wallet setup process through Thirdweb’s onboarding, making it easy to create a secure wallet.',

        'Step 2: Select your preferred sign-in option, such as entering an email address or using a social login (e.g., Google). This step allows Thirdweb to create a secure wallet for you without requiring an additional app. **Note**: Your email or social login will act as a recovery option, so use an account you can access long-term.',

        'Step 3: **Save your recovery phrase securely**. Thirdweb will generate a unique recovery phrase (sometimes called a "seed phrase" or "backup phrase"). This phrase is your key to recovering your wallet if you lose access. **Warning**: Do not share this phrase with anyone, and avoid storing it online (e.g., in a cloud document). Write it down and store it in a safe place. Losing this phrase means you could lose access to your wallet and funds.',

        'Step 4: Add funds to your wallet. If you need to add funds, use crypto on-ramp services like MoonPay or Wyre (often integrated into wallet providers) to purchase cryptocurrency using a credit/debit card or bank transfer. **Tip**: Be aware of processing times and fees for on-ramp services, and ensure you select the appropriate currency and blockchain network (e.g., BNB on Binance Smart Chain) as needed.',

        'Step 5: Familiarize yourself with wallet security practices. Before proceeding, review key wallet security tips, such as setting up two-factor authentication (2FA) if available, avoiding suspicious sites, and recognizing phishing attempts.',

        'Step 6: Check your wallet balance to confirm that your funds are available. Some wallets may take a few minutes to reflect newly deposited funds. You can refresh your wallet balance if needed to see your available funds.',

        'Step 7: Switch to the appropriate blockchain network if prompted. Many crypto sites, including THE FORGE, may require specific networks, like Ethereum or Binance Smart Chain. Follow the prompts to switch networks if necessary; this ensures your transaction will process correctly.',

        'Step 8: Click "FORGE" to begin creating your DOTs. This step will prompt your wallet to display a transaction summary with details on the forging cost and gas fees. **Note**: Review all transaction details carefully to ensure accuracy.',

        'Step 9: Approve the transaction in your wallet. Confirm the transaction in your wallet app, being mindful of the gas fees, which are necessary to complete transactions on the blockchain. **Reminder**: Only approve transactions you initiated to avoid scams.',

        'Step 10: Wait for the forging transaction to complete. Blockchain transactions may take a few seconds to several minutes, depending on network traffic. **Tip**: You can monitor the transaction’s progress in your wallet’s activity feed or via a block explorer link (such as Etherscan or BSCScan).',

        'Step 11: View your DOTs in "Your Medals Display Case" or in your wallet. Once confirmed, your newly forged DOTs should appear in both the display case on the site and in your wallet. **Note**: If they don’t appear automatically in your wallet, you may need to add the DOT token manually using the token’s contract address.',

        'Step 12: Log out of THE FORGE once finished. For optimal security, disconnect from the site within your wallet settings after completing your session. This minimizes any risk of unauthorized access to your wallet.'
    ], []);


    const steps = hasWallet ? walletUserSteps : newUserSteps;

    const renderSteps = useMemo(() => {
        if (hasWallet === null) {
            return (
                <>
                    <h3 className={styles.stepsText}>Do you already have a DeFi wallet?</h3>
                    <div className={styles.buttonContainer}>
                        <Button
                            btnName="Yes, I have a wallet"
                            onClick={() => setHasWallet(true)}
                            className={styles.actionButton}
                            isActive={false}
                        />
                        <Button
                            btnName="No, I need a wallet"
                            onClick={() => setHasWallet(false)}
                            className={styles.actionButton}
                            isActive={false}
                        />
                    </div>
                </>
            );
        }

        return (
            <>
                <h2 className={styles.title}>{hasWallet ? "Wallet User Walkthrough" : "New User Walkthrough"}</h2>
                <div className={styles.stepsContainer}>
                    <p className={styles.stepsText}>               
                        {steps[step - 1].split('. ').map((line, index) => (
                            <span className={styles.stepNumber} key={`step-${step}-line-${index}`}>
                                {line}.
                                <br />
                            </span>
                        ))}
                    </p>
                    <div className={styles.buttonContainer}>
                        {step > 1 && (
                            <Button
                                btnName="Back"
                                onClick={() => setStep(step - 1)}
                                className={styles.actionButton}
                                isActive={false}
                            />
                        )}
                        {step < steps.length && (
                            <Button
                                btnName="Next"
                                onClick={() => setStep(step + 1)}
                                className={styles.actionButton}
                                isActive={false}
                            />
                        )}
                        {step === steps.length && (
                            <Button
                                btnName="Close Walkthrough"
                                onClick={onRequestClose}
                                className={styles.actionButton}
                                isActive={false}
                            />
                        )}
                    </div>
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
                    className={styles.closeButton}
                    fontSize="10px"
                    isActive={false}
                />
            </div>
            {renderSteps}
        </Modal>
    );
};

export default React.memo(WalkthroughModal);
