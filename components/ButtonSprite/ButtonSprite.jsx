import { useState } from "react";
import classes from "../Button/Button.module.css"; // Use the new Button styles
import { useRouter } from "next/router";
import Image from "next/image";

function ButtonSprite(props) {
  const navigate = useRouter();
  const [isActive, setIsActive] = useState(props.isActive || false);

  // Function to handle button click, navigate if btnURL is provided
  const handleNavigate = (e) => {
    e.preventDefault();
    if (props.onClick) {
      props.onClick(e);
    }
    if (props.btnURL) {
      navigate.push(props.btnURL);
    }
    // Activate button state and play click sound
    setIsActive(true);
    playClickSound();
  };

  // Play click sound
  const playClickSound = () => {
    const audio = new Audio("../../sounds/button_click_2_-30dB.mp3");
    audio.currentTime = 0;
    audio.play();
  };

  const {
    btnText,
    btnSize = "original",
    icon,
    imageWidth = 50,
    imageHeight = 50,
    fontSize = 16,
    paddingRight = "0",
    paddingLeft = "0",
  } = props;

  return (
    <div className={`${classes.box} ${isActive ? classes.active : ""}`}>
      <div className={classes.glowEffect}></div>
      <button
        className={`${classes.btn} ${isActive ? classes.active : ""}`}
        style={{ fontSize: fontSize + "px" }}
        onClick={handleNavigate}
      >
        {icon && (
          <div className={classes.iconContainer}>
            <Image
              src={icon}
              alt="Icon"
              width={imageWidth}
              height={imageHeight}
              className={classes.img}
            />
          </div>
        )}
        <div className={classes.btnName}>
          <span
            className={classes.buttonName}
            style={{ paddingRight, paddingLeft }}
          >
            {btnText}
          </span>
        </div>
      </button>
    </div>
  );
}

export default ButtonSprite;
