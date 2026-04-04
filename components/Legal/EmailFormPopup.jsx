import React, { useState, useEffect } from "react";
import LegalDrawer from "./LegalDrawer";
import { sendContactUsEmail } from "../../supabase/forgeServices.js";

const EmailFormPopup = ({ isVisible, onClose, isClosing, address }) => {
  const [name, setName] = useState("");
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
      await sendContactUsEmail(email, message, address, name);
      setSuccessMessage("Your message has been sent successfully!");
      setIsSuccess(true);
      setEmail("");
      setMessage("");
      setName("");
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

  const inputStyle = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "6px",
    color: "var(--color-text-primary)",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.85rem",
    outline: "none",
    marginBottom: "1rem",
  };

  const labelStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "0.35rem",
    display: "block",
  };

  return (
    <LegalDrawer isOpen={isVisible} onClose={onClose} title="Contact Us">
      <h2>Contact XdRiP Digital Management</h2>

      {successMessage && (
        <p style={{ color: "var(--color-success)", marginBottom: "1rem", fontSize: "0.85rem" }}>
          {successMessage}
        </p>
      )}

      {!isSuccess && (
        <form onSubmit={handleSubmit}>
          <label style={labelStyle} htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle} htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle} htmlFor="message">Your Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "0.6rem 1.5rem",
              borderRadius: "6px",
              border: "1px solid rgba(37, 95, 244, 0.4)",
              background: "linear-gradient(135deg, var(--forge-blue-800) 0%, var(--forge-blue-700) 100%)",
              color: "#fff",
              cursor: isSubmitting ? "wait" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </LegalDrawer>
  );
};

export default EmailFormPopup;
