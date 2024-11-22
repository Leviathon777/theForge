import React, { useState } from "react";
import Style from "./CheckoutModal.module.css";
import { TermsOfService, UserAgreement } from "../componentsindex";

const CheckoutModal = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);

    const handleSubmit = () => {
        if (!name || !email) {
            alert("Please fill in all fields.");
            return;
        }
        if (!agreed) {
            alert("You must agree to the terms and conditions.");
            return;
        }
        onSubmit({ name, email, agreed });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={Style.modalOverlay}>
            <div className={Style.modalContent}>
                <h2>Enter Your Information</h2>
                <p className={Style.notice}>
                    To proceed, please provide the following:
                    <ul>
                        <li>Your <strong>name</strong> and <strong>email</strong>, required for accurate purchase tracking and receipt delivery.</li>
                        <li>This information will be securely linked to your wallet address.</li>
                        <li>We assure you this is a one-time data capture for proper record-keeping and communication purposes.</li>
                        <li>Once submitted, you will receive a welcome email and be redirected to forge your medal.</li>
                    </ul>
                </p>

                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className={Style.checkboxWrapper}>
                    <input
                        type="checkbox"
                        id="agreement"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <label htmlFor="agreement">
                        I have read and agree to the{" "}
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
                <button onClick={handleSubmit} className={Style.submitButton}>
                    Submit
                </button>
                <button onClick={onClose} className={Style.cancelButton}>
                    Cancel
                </button>
            </div>
            <TermsOfService
                isOpen={isTermsModalOpen}
                onRequestClose={() => setIsTermsModalOpen(false)}
            />
            <UserAgreement
                isOpen={isUserAgreementModalOpen}
                onRequestClose={() => setIsUserAgreementModalOpen(false)}
            />
        </div>
    );
};

export default CheckoutModal;
