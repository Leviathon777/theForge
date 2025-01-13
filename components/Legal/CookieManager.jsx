import React, { useState } from "react";
import Cookies from "js-cookie";
import styles from "./CookieManager.module.css";
import { PrivacyPolicy, TermsOfService, UserAgreement} from "../componentsindex";


const CookieManager = ({ preferences, updatePreferences, handleAcceptCookies, handleDeclineCookies }) => {
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);
    const closePreferencesModal = () => setShowPreferencesModal(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);
    const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const closeManager = () => {
        setIsClosing(true);
        setTimeout(() => {
            handleDeclineCookies();
        }, 500);
    };

    const acceptManager = () => {
        setIsClosing(true);
        setTimeout(() => {
            handleAcceptCookies();
        }, 500);
    };

    const togglePreference = (key) => {
        updatePreferences({ ...preferences, [key]: !preferences[key] });
    };

    const savePreferences = () => {
        try {
            document.cookie = `cookiePreferences=${JSON.stringify(preferences)};path=/;max-age=2592000`;
            localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
            closePreferencesModal();
        } catch (error) {
            console.error("Failed to save preferences:", error);
        }
    };

    return (
        <>
            <div className={`${styles.cookieOverlay} ${isClosing ? styles.slideDown : ""}`}>
                <div className={styles.cookieContent}>
                    <h2 className={styles.cookieHeader}>We Respect Your Privacy</h2>
                    <div className={styles.cookieBody}>
                        <p className={styles.cookieParagraph}>
                            At XdRiP, XMarket, XECHO, TheForge, XdRiPia Content, and our affiliates, we strive to provide a personalized and enhanced experience for all users. To achieve this, we use cookies and similar technologies to understand your preferences, improve site functionality, analyze website performance, and deliver tailored content, including promotions and marketing.
                        </p>
                        <p className={styles.cookieParagraph}>
                            <strong>How We Use Your Information:</strong> When you interact with our platform, we may collect and process limited information about your browsing behavior. This data helps us to:
                        </p>
                        <ul className={styles.cookieList}>
                            <li>Optimize your experience by remembering your preferences.</li>
                            <li>Understand how you use our services, enabling us to improve functionality.</li>
                            <li>Deliver relevant content, promotions, and advertisements that match your interests.</li>
                            <li>Ensure compliance with security and legal obligations.</li>
                        </ul>
                        <p className={styles.cookieParagraph}>
                            Please note that we <strong>do not sell your personal data</strong> to third parties. Any information shared is strictly for the purposes outlined above and remains protected under our
                            <button
                                className={styles.linkButton}
                                onClick={() => setIsPrivacyPolicyModalOpen(true)}
                            >
                                Privacy Policy
                            </button>.
                        </p>
                        <p className={styles.cookieParagraph}>
                            <strong>Your Choices Matter:</strong> You are in control of your data and how it is used. By clicking "Accept All," you consent to the use of cookies for the purposes stated above. If you prefer to customize your cookie settings, you may click "Manage Preferences" to select only essential cookies or decline non-essential cookies altogether.
                        </p>
                        <p className={styles.cookieParagraph}>
                            Additionally, while we may use limited data to send personalized promotional content, you can
                            <button
                                className={styles.linkButton}
                                onClick={() => setIsUserAgreementModalOpen(true)}
                            >
                                opt out of receiving promotional emails
                            </button>{" "}
                            at any time. Opting out will not affect essential service communications required for your account.
                        </p>
                    </div>
                    <div className={styles.footerLinks}>
                        <p>
                            <button
                                className={styles.linkButton}
                                onClick={() => setIsTermsModalOpen(true)}
                            >
                                Terms of Service
                            </button>{" "}
                            |{" "}
                            <button
                                className={styles.linkButton}
                                onClick={() => setIsPrivacyPolicyModalOpen(true)}
                            >
                                Privacy Policy
                            </button>{" "}
                            |{" "}
                            <button
                                className={styles.linkButton}
                                onClick={() => setIsUserAgreementModalOpen(true)}
                            >
                                User Agreement
                            </button>
                        </p>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={`${styles.cookieButton} ${styles.accept}`} onClick={acceptManager}>
                            Accept All
                        </button>
                        <button className={`${styles.cookieButton} ${styles.decline}`} onClick={closeManager}>
                            Decline
                        </button>
                        <button
                            onClick={() => setShowPreferencesModal(true)}
                            className={`${styles.cookieButton} ${styles.manage}`}
                        >
                            Manage Preferences
                        </button>
                    </div>
                </div>
            </div>

            {
                isTermsModalOpen && (
                    <div className={styles.modal}>
                        <TermsOfService />
                        <button className={styles.closeButton} onClick={() => setIsTermsModalOpen(false)}>
                            Close
                        </button>
                    </div>
                )
            }
            {
                isPrivacyPolicyModalOpen && (
                    <PrivacyPolicy
                        isOpen={isPrivacyPolicyModalOpen}
                        onRequestClose={() => setIsPrivacyPolicyModalOpen(false)}
                    />
                )
            }
            {
                isUserAgreementModalOpen && (
                    <div className={styles.modal}>
                        <UserAgreement />
                        <button className={styles.closeButton} onClick={() => setIsUserAgreementModalOpen(false)}>
                            Close
                        </button>
                    </div>
                )
            }
            {
                showPreferencesModal && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: "99999",
                        }}
                    >
                        <div
                            style={{
                                background: "rgba(0, 0, 0, 0.8)",
                                padding: "20px",
                                borderRadius: "8px",
                                border: "4px solid black",
                                width: "90%",
                                maxWidth: "500px",
                                textAlign: "left",
                            }}
                        >
                            <h2 style={{ textAlign: "center" }}>Manage Cookie Preferences</h2>
                            <p style={{ marginBottom: "10px" }}>
                                Customize how we use cookies and similar technologies to enhance your experience. Select the categories of cookies you wish to allow:
                            </p>
                            <form style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                                    <input
                                        type="checkbox"
                                        checked={preferences.essential}
                                        disabled
                                    />{" "}
                                    <span>Essential Cookies (Required for website functionality)</span>
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={(e) => updatePreferences("analytics", e.target.checked)}
                                    />{" "}
                                    <span>Analytics Cookies (Help us improve our services)</span>
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={() => togglePreference("marketing")}
                                    />{" "}
                                    <span>Marketing Cookies (Deliver personalized promotions)</span>
                                </label>
                            </form>
                            <div style={{ marginTop: "20px", textAlign: "center" }}>
                                <button
                                    onClick={savePreferences}
                                    style={{
                                        margin: "0 10px",
                                        padding: "10px 20px",
                                        background: "#28a745",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Save Preferences
                                </button>
                                <button
                                    onClick={closePreferencesModal}
                                    style={{
                                        margin: "0 10px",
                                        padding: "10px 20px",
                                        background: "#dc3545",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
};

export default CookieManager;
