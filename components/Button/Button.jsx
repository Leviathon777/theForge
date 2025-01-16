import React from "react";
import Style from "./Button.module.css";
import Image from "next/image";

const Button = ({
  id,
  btnName,
  onClick,
  icon,
  classStyle = "",
  imageWidth = 50,
  imageHeight = 50,
  isActive = false,
  setIsActive,
  fontSize,
  paddingRight = "0",
  paddingLeft = "0",
  padding = "0px 0px",
  title = "",
  // NEW PROP
  background, 
}) => {
  const playClickSound = () => {
    const audio = new Audio("../../sounds/button_click_2_-30dB.mp3");
    audio.currentTime = 0;
    audio.play();
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
    playClickSound();
    if (setIsActive) {
      setIsActive(true);
    }
  };

  return (
    <div className={`${Style.box} ${isActive ? Style.active : ""}`}>
      <button
        id={id}
        className={`btn ${classStyle} ${isActive ? "active" : ""}`}
        style={{
          fontSize,
          ...(background && { background }),
        }}
        onClick={handleButtonClick}
        title={title}
      >
        {icon && (
          <div className={Style.iconContainer}>
            <Image
              src={icon}
              alt="Icon"
              width={imageWidth}
              height={imageHeight}
              className={Style.img}
            />
          </div>
        )}
        <div className={Style.btnName}>
          <span
            className={Style.buttonName}
            style={{ paddingRight, paddingLeft, padding }}
          >
            {btnName}
          </span>
        </div>
      </button>
    </div>
  );
};

export default Button;
