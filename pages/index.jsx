import React, { useEffect, useState, useCallback } from "react";
import { EntryPage, MobileModal } from "../components/componentsindex";





const HomePage = ({ 

}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPwaModalVisible, setIsPwaModalVisible] = useState(false);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
        })
        .catch(error => {
        });
    });
  }
  const handleDismissPwaModal = () => {
    setIsPwaModalVisible(false);
  };

  useEffect(() => {
    const detectMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    detectMobile();
    window.addEventListener("resize", detectMobile);
    return () => window.removeEventListener("resize", detectMobile);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
     
      if (isMobile) {
        setIsPwaModalVisible(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <div>
        <EntryPage />    
    </div>
  );
};

export default HomePage;