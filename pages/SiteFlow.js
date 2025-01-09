import React from 'react';
import styles from '../styles/SiteFlow.module.css';

const SiteFlow = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.heading}>Site Flow ReadMe</h1>
                <p className={styles.description}>
                    This document provides a comprehensive explanation of the user journey, features, and interactions on our site, detailing the flow from user onboarding to the forging of medals. Each section has been expanded to ensure clarity and to include all relevant checks, processes, and modals involved in the experience.      </p>

                {/* Accessing the Website */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Step 1: Accessing the Website</h2>
                    <div className={styles.stepContent}>
                        <h4>1. Entry Page</h4>
                        <ul>
                            <li>Upon entering the site, users are presented with a Cookies Modal requiring approval or decline.</li>
                            <li>The modal includes direct links to the Privacy Policy and Terms of Service for transparency and compliance.</li>
                        </ul>
                        <h4>2. Homepage</h4>
                        <ul>
                            <li>Users land on the homepage, greeted by an interactive and visually appealing UI centered on the theme of "THE FORGE - Medals of Honor."</li>
                            <li>A Connect Wallet button is displayed in the forging area.</li>
                        </ul>
                    </div>
                </section>


                {/* Wallet Connection */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Step 2: Wallet Connection</h2>
                    <div className={styles.stepContent}>
                        <h4>1. Connect Wallet Options</h4>
                        <ul>
                            <li>Supported wallets: MetaMask, WalletConnect, and local wallets.</li>
                            <li>Thirdweb modal for wallet selection.</li>
                            <li>Upon successful wallet connection:
                                <ul>
                                    <li>Wallet address is not openly displayed, ensuring user privacy.</li>
                                    <li>System checks for user profile existence in the database to determine the user's access level.</li>
                                    <li>
                                        Access to core features is unlocked, including:
                                        <ul>
                                            <li>Forging medals.</li>
                                            <li>Interacting with the Transak widget for fiat-to-crypto onboarding.</li>
                                            <li>Utilizing advanced investor tools.</li>
                                            <li>Creating a guest wallet for users without an external wallet.</li>
                                        </ul>
                                    </li>
                                    <li>Profile and wallet balances are fetched in real-time, enabling users to manage their investments and track revenue share metrics effectively.</li>
                                </ul>
                            </li>
                        </ul>
                        <h4>2. Wallet Check Outcomes</h4>
                        <ul>
                            <li>
                                <strong>Overview:</strong>
                                <ul>
                                    <li>Users without an external wallet can create a guest wallet during onboarding.</li>
                                    <li>The guest wallet is a temporary solution tied to the user’s email or phone number.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Usage:</strong>
                                <ul>
                                    <li>Fully functional for medal forging and investment features.</li>
                                    <li>Users are encouraged to migrate to a permanent wallet for better security.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Migration Process:</strong>
                                <ul>
                                    <li>Export guest wallet’s private key or transfer assets to a permanent wallet.</li>
                                    <li>Step-by-step guidance provided in the Investor Dashboard.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>


                {/* Profile Creation and Verification */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Step 3: Profile Creation and Verification</h2>
                    <div className={styles.stepContent}>
                        <h4>1. Profile Page</h4>
                        <ul>
                            <li>Fields include Full Name, Email, and KYC status.</li>
                            <li>
                                Dynamic Adjustments by Territory:
                                <ul>
                                    <li>
                                        During profile creation, the system dynamically adjusts the presented agreements and compliance requirements based on the user's geographical location.
                                    </li>
                                    <li>
                                        Examples:
                                        <ul>
                                            <li>
                                                <strong>UK Users:</strong>
                                                <ul>
                                                    <li>Shown additional compliance disclosures required by UK financial regulations.</li>
                                                    <li>Specific agreements tied to UK compliance laws are displayed, ensuring adherence to local regulatory standards.</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <strong>EU Users:</strong> Data privacy and GDPR-compliant agreements are highlighted.
                                            </li>
                                            <li>
                                                <strong>Other Regions:</strong> Custom agreements tailored to regional regulations are dynamically fetched and shown.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        These adjustments ensure all users view the relevant legal and compliance materials based on their location.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                KYC Verification:
                                <ul>
                                    <li>For General Medals: KYC is optional.</li>
                                    <li>For Forging the Eternal Medal: KYC approval is mandatory.</li>
                                    <li>
                                        <strong>Statuses:</strong>
                                        <ul>
                                            <li>
                                                <strong>Approved:</strong> Full access to all medals, including Eternal.
                                            </li>
                                            <li>
                                                <strong>In Review:</strong> User notified that the Eternal Medal cannot be forged until approval.
                                            </li>
                                            <li>
                                                <strong>Rejected:</strong> Clear instructions to contact support for assistance.
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>


                {/* Accessing Features */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Step 4: Accessing Features</h2>
                    <div className={styles.stepContent}>
                        <h4>1. Investor Dashboard</h4>
                        <ul>
                            <li>
                                <strong>Available Features:</strong>
                                <ul>
                                    <li>View medals forged.</li>
                                    <li>Check wallet balances (BNB, XdRiP).</li>
                                    <li>Access revenue share metrics for applicable medals.</li>
                                </ul>
                            </li>
                            <li>
                                Wallet checks dynamically enable or disable specific actions based on eligibility criteria. For example:
                                <ul>
                                    <li>Forging higher-tier medals requires prerequisite medals to be owned.</li>
                                    <li>Access to the Transak widget for seamless fiat-to-crypto onboarding is contingent on a connected wallet and created investor profile.</li>
                                    <li>These checks also determine whether users can initiate direct forging transactions or need to complete additional steps, such as KYC verification for specific medals.</li>
                                </ul>
                            </li>
                        </ul>
                        <h4>2. Vault Actions Dropdown</h4>
                        <ul>
                            <li>
                                <strong>Includes Options Like:</strong>
                                <ul>
                                    <li>Investor Profile: Display profile details.</li>
                                    <li>KYC Verification: Quick link to the KYC page.</li>
                                    <li>Access Transak: Seamless fiat-to-crypto onboarding.</li>
                                    <li>Investor Wallet: A detailed view of holdings and investments.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>


                {/* Forging Medals */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Step 5: Forging Medals</h2>
                    <div className={styles.stepContent}>
                        <h4>1. The Forge Section</h4>
                        <ul>
                            <li>
                                An interactive carousel showcases all medal types available for forging. Each medal displays dynamic information fetched directly from the blockchain, including:
                                <ul>
                                    <li>Price: Displayed in BNB, with a real-time conversion to USD for user convenience.</li>
                                    <li>Revenue Share Percentage: Indicates the user's share of the revenue pool.</li>
                                    <li>XdRiP Bonuses: Any additional rewards tied to the specific medal.</li>
                                    <li>Inventory Status: Tracks the number of medals forged and remaining availability in real time.</li>
                                </ul>
                            </li>
                        </ul>
                        <h4>2. Eligibility Checks</h4>
                        <ul>
                            <li>
                                The system conducts prerequisite checks to ensure compliance with medal forging rules:
                                <ul>
                                    <li>Example: To forge an Uncommon Medal, users must already own at least one Common Medal.</li>
                                    <li>
                                        For the Eternal Medal, additional criteria include:
                                        <ul>
                                            <li>KYC approval.</li>
                                            <li>Sufficient BNB balance (200 BNB).</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <h4>3. Payment Modal</h4>
                        <ul>
                            <li>
                                <strong>Pay with Crypto:</strong>
                                <ul>
                                    <li>The modal calculates the BNB required for the selected medal and displays it.</li>
                                    <li>Real-time gas estimation is fetched to ensure transaction feasibility.</li>
                                    <li>Upon confirmation, the system sends transaction data (medal type and IPFS hash) to the forging smart contract.</li>
                                    <li>The contract forges the medal, deducts the required BNB, and deposits the forged medal into the user’s connected wallet.</li>
                                    <li>A receipt is generated and emailed to the user for their records.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Transak Widget Integration:</strong>
                                <ul>
                                    <li>
                                        This widget provides fiat-to-crypto onboarding where users can acquire BNB to manually initiate forging. Users:
                                        <ul>
                                            <li>Select the required amount of BNB for medal forging.</li>
                                            <li>Complete fiat-to-crypto conversion using supported payment methods.</li>
                                            <li>Use the acquired BNB to proceed with the manual forging process.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>Transak One Future Integration:</strong>
                                <ul>
                                    <li>When implemented, Transak One will automate the fiat-to-BNB conversion directly tied to the forging process.</li>
                                    <li>
                                        Upon medal selection and clicking "Pay with Transak One," the system will:
                                        <ul>
                                            <li>Automatically calculate and process the BNB conversion required for the transaction.</li>
                                            <li>Send the transaction data (medal type, IPFS hash, payment details) to the smart contract.</li>
                                            <li>Forge the medal and deposit it directly into the user’s wallet, without requiring additional user steps.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>


                {/* Transak Integration */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Step 6: Transak Integration</h2>
                    <div className={styles.stepContent}>
                        <h4>1. Why Transak?</h4>
                        <ul>
                            <li>
                                Transak is integrated into the platform to simplify the process of acquiring the required cryptocurrency for forging medals. This feature is particularly beneficial for:
                                <ul>
                                    <li>
                                        <strong>New Users:</strong> Those unfamiliar with cryptocurrencies who need a seamless way to onboard fiat to BNB.
                                    </li>
                                    <li>
                                        <strong>Experienced Users:</strong> Streamlining their crypto acquisition process for faster medal forging.
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <h4>2. Integration Details</h4>
                        <ul>
                            <li>
                                <strong>Transak Widget:</strong>
                                <ul>
                                    <li>
                                        This widget supports fiat-to-BNB conversion, which users can access manually through the "Vault Actions" dropdown. Users can use this feature to onboard funds and manually initiate forging.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>Transak One Future Integration:</strong>
                                <ul>
                                    <li>
                                        <strong>Blockchain Communication:</strong>
                                        <ul>
                                            <li>Transak One will directly interact with blockchain protocols, automating fiat-to-crypto onboarding and forging processes.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Smart Contract Interactions:</strong>
                                        <ul>
                                            <li>Automates medal forging by:</li>
                                            <ul>
                                                <li>Sending converted BNB directly to the forging smart contract.</li>
                                                <li>Passing required metadata (medal type, IPFS hash, price) for Medal forging.</li>
                                            </ul>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>User Experience:</strong>
                                        <ul>
                                            <li>Eliminates manual steps by integrating payment and forging into a single, streamlined transaction.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <h4>3. Technical Flow When the Forge is Triggered</h4>
                        <ul>
                            <li>
                                When a user confirms forging a medal:
                                <ul>
                                    <li>
                                        <strong>Data Sent to the Contract:</strong>
                                        <ul>
                                            <li>Medal type (e.g., Common, Uncommon, Rare).</li>
                                            <li>IPFS hash containing metadata for the specific medal.</li>
                                            <li>Payment amount (in BNB or other specified token).</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Smart Contract Actions:</strong>
                                        <ul>
                                            <li>Validate user eligibility based on prerequisites (e.g., ownership of previous medals).</li>
                                            <li>Deduct payment and forge the medal as a new Medal.</li>
                                            <li>Update the inventory count and user’s medal balance.</li>
                                            <li>Emit events for transaction tracking and transparency.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>System Logging:</strong>
                                        <ul>
                                            <li>The system logs the transaction details (user address, transaction hash, timestamp, etc.).</li>
                                            <li>Updates the investor dashboard with the new medal details.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Future Integration with Transak One:</strong>
                                        <ul>
                                            <li>Once implemented, Transak One will automate the fiat-to-BNB conversion and seamlessly pass the required payment details to the smart contract.</li>
                                            <li>This integration will:</li>
                                            <ul>
                                                <li>Eliminate the need for manual crypto purchases.</li>
                                                <li>Provide a streamlined, user-friendly experience.</li>
                                                <li>Ensure secure, transparent interactions directly with the blockchain.</li>
                                            </ul>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <h4>4. User Flow</h4>
                        <ul>
                            <li>
                                <strong>Option 1: Vault Actions Dropdown (Transak Widget):</strong>
                                <ul>
                                    <li>Access the Transak widget via the Vault Actions dropdown.</li>
                                    <li>Steps:</li>
                                    <ul>
                                        <li>Specify the BNB amount required.</li>
                                        <li>Select a payment method (credit card, bank transfer, etc.).</li>
                                        <li>Transak processes the transaction, and the acquired BNB is credited to the user’s wallet.</li>
                                        <li>The user can then manually proceed to forge medals using their acquired BNB.</li>
                                    </ul>
                                </ul>
                            </li>
                            <li>
                                <strong>Option 2: Transak One (Future Integration):</strong>
                                <ul>
                                    <li>Integrated directly with the Forge button.</li>
                                    <li>Steps:</li>
                                    <ul>
                                        <li>The user selects a medal and clicks "Forge."</li>
                                        <li>Chooses the "Pay with Transak One" option in the payment modal.</li>
                                        <li>
                                            Transak One will automatically:
                                            <ul>
                                                <li>Convert fiat to BNB in real time.</li>
                                                <li>Execute the forging transaction via the smart contract.</li>
                                                <li>Forge the medal and deposit it directly into the user’s wallet.</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </ul>
                            </li>
                        </ul>
                        <h4>5. Benefits of Transak Integration</h4>
                        <ul>
                            <li>Accessibility: Removes the need for external exchanges, enabling users to acquire BNB directly on the platform.</li>
                            <li>Streamlined Process: Combines payment and forging into a single, seamless action.</li>
                            <li>Secure and Transparent: Ensures all transactions are processed securely on the blockchain, with clear notifications at every step.</li>
                        </ul>
                    </div>
                </section>


                {/* Compliance Modals */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Compliance Modals</h2>
                    <div className={styles.stepContent}>
                        <h4>1. Privacy Policy & Terms of Service</h4>
                        <ul>
                            <li>Displayed during wallet connection and payment processes.</li>
                        </ul>
                        <h4>2. Cookies Modal</h4>
                        <ul>
                            <li>Shown on the entry page.</li>
                            <li>Users can approve or decline cookies.</li>
                            <li>Includes links to Privacy Policy and Terms of Service.</li>
                        </ul>
                        <h4>3. UK Compliance Modal</h4>
                        <ul>
                            <li>Triggered for UK-based users accessing investor sections.</li>
                            <li>
                                Content:
                                <ul>
                                    <li>Legal disclosures.</li>
                                    <li>Regulatory compliance requirements.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>


                {/* Error Handling */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Error Handling</h2>
                    <div className={styles.stepContent}>
                        <h4>1. Common Errors</h4>
                        <ul>
                            <li>
                                <strong>Insufficient Funds:</strong>
                                <ul>
                                    <li>Users are notified if BNB or XdRiP balance is insufficient.</li>
                                    <li>Option to onboard funds via Transak.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Prerequisite Medals Missing:</strong>
                                <ul>
                                    <li>Clear message indicating which medal(s) are required.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>KYC Status:</strong>
                                <ul>
                                    <li>Users are guided on how to resolve KYC issues (e.g., incomplete or rejected applications).</li>
                                </ul>
                            </li>
                        </ul>
                        <h4>2. Real-Time Updates</h4>
                        <ul>
                            <li>Notifications inform users of transaction success or failure.</li>
                            <li>Wallet and profile data auto-refresh post-action.</li>
                        </ul>
                    </div>
                </section>


                {/* Additional Notes */}
                <section className={styles.section}>
                    <h2 className={styles.subheading}>Additional Notes</h2>
                    <div className={styles.stepContent}>
                        <ul>
                            <li>The Eternal Medal serves as a unique offering, emphasizing exclusivity and compliance.</li>
                            <li>All actions are secured via blockchain transactions, ensuring transparency and traceability.</li>
                            <li>
                                Transak One is expected to seamlessly integrate with wallet connection and forging processes to enhance the user journey once introduced, providing a streamlined experience. Upon connecting their wallet, users can leverage this feature to eliminate the manual steps of acquiring cryptocurrency. Transak One will be designed to:
                                <ul>
                                    <li>Automatically convert fiat into BNB.</li>
                                    <li>Process the forging transaction.</li>
                                    <li>Deposit the forged medal directly into the user’s wallet once implemented.</li>
                                </ul>
                                This streamlined experience ensures accessibility for new users unfamiliar with crypto while offering a faster, hassle-free solution for experienced users. By reducing complexity and integrating payment directly with forging actions, Transak One makes medal acquisition both efficient and user-friendly.
                            </li>
                            <li>The site’s design prioritizes user experience, with intuitive navigation and helpful prompts.</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SiteFlow;
