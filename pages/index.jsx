import React from 'react';
import TheForge from './theForgePage';
const HomePage = () => {

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          console.log("ServiceWorker registered: ", registration);
        })
        .catch(error => {
          console.log("ServiceWorker registration failed: ", error);
        });
    });
  }
  



  return (
    <div>      
      <TheForge />
    </div>
  );
};
export default HomePage;
