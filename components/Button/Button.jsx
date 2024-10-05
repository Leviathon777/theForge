import React from "react";
import Style from "./Button.module.css";
import Image from "next/image";

const Button = ({ btnName, handleClick, icon, classStyle, imageWidth, imageHeight, isActive, setIsActive, fontSize, paddingRight, paddingLeft }) => {
  const playClickSound = () => {
    const audio = new Audio("../../sounds/button_click_2_-30dB.mp3");
    audio.currentTime = 0;
    audio.play();
  };

  const handleButtonClick = () => {
    console.log("Button clicked");
    if (handleClick) {
      handleClick();
    }
    playClickSound();
    if (setIsActive) {
      setIsActive(true);
    }
  };

  const buttonStyle = {
    fontSize: fontSize || "inherit",
    padding: "0", // Reset overall padding for button
  };

  const buttonNameStyle = {
    paddingRight: paddingRight || "0",
    paddingLeft: paddingLeft || "0",
  };

  return (
    <div className={`${Style.box} ${isActive ? Style.active : ""}`}>
      <button
        className={`${Style.btn} ${classStyle} ${isActive ? Style.active : ""}`}
        style={buttonStyle}
        onClick={handleButtonClick}
      >
        {icon && (
          <div className={Style.iconContainer}>
            <Image
              src={icon}
              alt="Icon"
              width={imageWidth || 50}
              height={imageHeight || 50}
            />
            <div className={Style.btnName}>
              <span className={Style.buttonName} style={buttonNameStyle}>{btnName}</span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default Button;