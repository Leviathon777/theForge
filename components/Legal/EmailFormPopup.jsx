import React, { useState, useEffect } from "react";
import styles from "./EmailFormPopup.module.css";
import Modal from "react-modal";
import { sendContactUsEmail } from "../../firebase/forgeServices.js";
import { Button } from "../componentsindex";

const EmailFormPopup = ({ isVisible, onClose, isClosing, address }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with:", { name, email, message });
    setIsSubmitting(true);
    setSuccessMessage("");
    setIsSuccess(false);

    try {
      await sendContactUsEmail(email, message, address, name);
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
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, onClose]);

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      contentLabel="Contact Us"
      className={styles.modal}
      overlayClassName={`${styles.modalOverlay} ${isClosing ? styles.slideDown : ""}`}
    >
      <div className={styles.modalWrapper}>
        <div className={styles.close_buttonContainer}>
          <Button
            btnName="X"
            onClick={onClose}
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
        <h2 className={styles.title}>Contact XDRIP Digital Management</h2>
        {successMessage && <p className={styles.success}>{"Your message has been sent successfully!"}</p>}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="name" className={styles.label}>
              Your Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
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
            <Button
              btnName="Submit"
              onClick={handleSubmit}
              fontSize=".8rem"
              paddingTop=".5rem"
              paddingRight=".75rem"
              paddingBottom=".5rem"
              paddingLeft=".75rem"
              background=""
            />
          </form>
        )}
      </div>
    </Modal>
  );
};

export default EmailFormPopup;
