import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Style from "./InvestorProfileModal.module.css";
import { TermsOfService, UserAgreement, Button } from "../componentsindex";

const InvestorProfileModal = ({ isOpen, onClose, onSubmit, walletAddress }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [territory, setTerritory] = useState("US"); // Default territory
    const [agreed, setAgreed] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);
    const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
    const [errors, setErrors] = useState({});

    const isFormComplete = name && email && agreed && walletAddress;

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Full Name is required.";
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
            newErrors.email = "Valid Email Address is required.";
        if (!walletAddress) newErrors.walletAddress = "Wallet connection is required.";
        if (!agreed) newErrors.agreed = "You must agree to the Terms and User Agreement.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        console.log("Agreed State:", agreed);
        if (!validateForm()) {
            setShowIncompleteAlert(true);
            return;
        }

        onSubmit({
            name,
            email,
            agreed,
            phone: phone || null,
            territory: territory || null,
            walletAddress,
        });
        onClose();
    };

    const handleStayAndContinue = () => {
        setShowIncompleteAlert(false);
    };

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setEmail("");
            setPhone("");
            setTerritory("US");
            setAgreed(false);
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className={Style.modalOverlay}>
                <div className={Style.modalContent}>
                    <h2>Set Up Your Investor Profile</h2>
                    <p className={Style.notice}>
                        Completing your investor profile is essential to ensure a secure and seamless experience:
                        <ul>
                            <li><strong>Name</strong> and <strong>Email</strong> are required for tracking purchases, transaction receipts, and account management.</li>
                            <li>Your profile will be securely linked to your wallet address for record-keeping.</li>
                            <li>It will also streamline any future KYC (Know Your Customer) applications.</li>
                        </ul>
                    </p>

                    {/* Wallet Address Display */}
                    <div className={Style.walletDisplay}>
                        {walletAddress ? (
                            <p><strong>Connected Wallet:</strong> {walletAddress}</p>
                        ) : (
                            <p className={Style.errorMsg}>Wallet not connected. Please connect your wallet.</p>
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={errors.name ? Style.inputError : ""}
                    />
                    {errors.name && <p className={Style.errorMsg}>{errors.name}</p>}

                    <input
                        type="email"
                        placeholder="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? Style.inputError : ""}
                    />
                    {errors.email && <p className={Style.errorMsg}>{errors.email}</p>}

                    <div className={Style.phoneSection}>
                        <label className={Style.phoneLabel}>Phone Number (Optional)</label>
                        <div className={Style.phoneWrapper}>
                            <select
                                value={territory}
                                onChange={(e) => setTerritory(e.target.value)}
                                className={Style.territorySelect}
                            >
                                <option value="US">🇺🇸 +1 (US)</option>
                                <option value="CA">🇨🇦 +1 (Canada)</option>
                            </select>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={Style.phoneInput}
                            />
                        </div>
                    </div>

                    <div className={Style.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="agreement"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="agreement">
                            I agree to the{" "}
                            <button
                                type="button"
                                className={Style.linkButton}
                                onClick={() => setIsTermsModalOpen(true)}
                            >
                                Terms of Use
                            </button>{" "}
                            and{" "}
                            <button
                                type="button"
                                className={Style.linkButton}
                                onClick={() => setIsUserAgreementModalOpen(true)}
                            >
                                User Agreement
                            </button>.
                        </label>
                    </div>

                    {errors.walletAddress && <p className={Style.errorMsg}>{errors.walletAddress}</p>}

                    <button onClick={handleSubmit} className={Style.submitButton}>
                        Confirm Profile
                    </button>
                    <button onClick={onClose} className={Style.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
};

// Prop validation
InvestorProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    walletAddress: PropTypes.string,
};

export default InvestorProfileModal;
