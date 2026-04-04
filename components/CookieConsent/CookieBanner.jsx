import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import styles from "./CookieBanner.module.css";

const STORAGE_KEY = "forge_cookie_consent";

const COOKIE_CATEGORIES = [
  {
    key: "essential",
    title: "Essential",
    description: "Required for core functionality. Wallet connections, authentication, and session management.",
    required: true,
  },
  {
    key: "functional",
    title: "Functional",
    description: "Theme preferences, language settings, and interface customizations.",
    required: false,
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Page views, feature usage, and performance monitoring to improve the platform.",
    required: false,
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Personalized recommendations and communication preferences.",
    required: false,
  },
];

const DEFAULT_PREFS = { essential: true, functional: true, analytics: true, marketing: false };

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = useCallback((consent) => {
    const data = { ...consent, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    Cookies.set("cookiesAccepted", "true", { expires: 365 });
    Cookies.set("cookiePreferences", JSON.stringify(data), { expires: 365 });
    setShowBanner(false);
    setDrawerOpen(false);
  }, []);

  const handleAcceptAll = () => saveConsent({ essential: true, functional: true, analytics: true, marketing: true });
  const handleRejectAll = () => saveConsent({ essential: true, functional: false, analytics: false, marketing: false });

  const handleDrawerClose = (saved) => {
    setDrawerOpen(false);
    if (!saved) setShowBanner(true);
  };

  const handleDrawerSave = () => saveConsent(prefs);
  const handleDrawerAcceptAll = () => saveConsent({ essential: true, functional: true, analytics: true, marketing: true });

  const togglePref = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && drawerOpen) handleDrawerClose(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [drawerOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Banner */}
      {!drawerOpen && (
        <div className={`${styles.banner} ${showBanner ? styles.bannerVisible : ""}`}>
          <div className={styles.bannerInner}>
            <div className={styles.icon}><FontAwesomeIcon icon={faShieldHalved} /></div>
            <p className={styles.bannerText}>
              We use cookies to enhance your experience, analyze platform usage, and support wallet connections.
            </p>
            <div className={styles.bannerActions}>
              <button className={styles.btnReject} onClick={handleRejectAll}>
                Essential Only
              </button>
              <button className={styles.btnCustomize} onClick={() => { setShowBanner(false); setDrawerOpen(true); }}>
                Customize
              </button>
              <button className={styles.btnAccept} onClick={handleAcceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {mounted && createPortal(
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleDrawerClose(false)}
              />
              <motion.div
                className={styles.drawer}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              >
                <div className={styles.drawerHeader}>
                  <div className={styles.drawerHeaderText}>
                    <h3>Cookie Preferences</h3>
                    <p>Manage how we use data on this platform</p>
                  </div>
                  <button
                    className={styles.closeBtn}
                    onClick={() => handleDrawerClose(false)}
                    aria-label="Close"
                  >
                    &#10005;
                  </button>
                </div>

                <div className={styles.drawerContent}>
                  {COOKIE_CATEGORIES.map((cat) => (
                    <div key={cat.key} className={styles.category}>
                      <div className={styles.categoryHeader}>
                        <span className={styles.categoryTitle}>{cat.title}</span>
                        {cat.required ? (
                          <span className={styles.requiredBadge}>Required</span>
                        ) : (
                          <label className={styles.toggle}>
                            <input
                              type="checkbox"
                              className={styles.toggleInput}
                              checked={prefs[cat.key]}
                              onChange={() => togglePref(cat.key)}
                            />
                            <span className={styles.toggleTrack} />
                            <span className={styles.toggleThumb} />
                          </label>
                        )}
                      </div>
                      <p className={styles.categoryDesc}>{cat.description}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.drawerFooter}>
                  <button className={styles.btnDrawerAccept} onClick={handleDrawerAcceptAll}>
                    Accept All
                  </button>
                  <button className={styles.btnDrawerSave} onClick={handleDrawerSave}>
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default CookieBanner;
