import React, { useState, useEffect } from "react";
import "./Xoast.module.css";

let xoastId = 0;

export const XoastContext = React.createContext();

export const XoastProvider = ({ children }) => {
  const [xoasts, setXoasts] = useState([]);

  const addXoast = (message, type = "info", duration = 3000) => {
    const id = xoastId++;
    setXoasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeXoast(id), duration);
  };

  const removeXoast = (id) => {
    setXoasts((prev) => prev.filter((xoast) => xoast.id !== id));
  };

  return (
    <XoastContext.Provider value={{ addXoast }}>
      {children}
      <div className="xoastContainer">
        {xoasts.map((xoast) => (
          <div
            key={xoast.id}
            className={`xoast ${xoast.type}`}
            onClick={() => removeXoast(xoast.id)}
          >
            {xoast.message}
          </div>
        ))}
      </div>
    </XoastContext.Provider>
  );
};

export const useXoast = () => React.useContext(XoastContext);
