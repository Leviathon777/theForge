import React, { useState, useEffect } from "react";
import styles from "./EmailFormPopup.module.css";
import Modal from "react-modal";
import { sendContactUsEmail } from "../../firebase/forgeServices.js";

const EmailFormPopup = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setIsSuccess(false);

    try {
      await sendContactUsEmail(email, message);
      setSuccessMessage("Your message has been sent successfully!");
      setIsSuccess(true);
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
      setSuccessMessage("Failed to send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        setIsSuccess(false);
        onClose();
      }, 2000); // 2 seconds timeout
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, onClose]);

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      contentLabel="Contact Us"
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalWrapper}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>Send Us an Email</h2>
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="email" className={styles.label}>
              Your Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="message" className={styles.label}>
              Your Message:
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className={styles.textarea}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default EmailFormPopup;
