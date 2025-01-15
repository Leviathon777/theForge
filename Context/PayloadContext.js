import React, { createContext, useState, useContext } from "react";

const PayloadContext = createContext();

export const PayloadProvider = ({ children }) => {
  const [activatePayload, setActivatePayload] = useState(false);

  return (
    <PayloadContext.Provider value={{ activatePayload, setActivatePayload }}>
      {children}
    </PayloadContext.Provider>
  );
};

export const usePayload = () => useContext(PayloadContext);
