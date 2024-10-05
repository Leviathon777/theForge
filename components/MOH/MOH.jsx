import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// INTERNAL IMPORT
import Style from "./MOH.module.css";
import the_forge from "../../img/the_forge.png";
import moh_entry from "../../img/moh_entry.png";
//import { Button } from "../../components/componentsindex.js";
import { ButtonSprite } from "../../components/componentsindex.js";

const MOH = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/theForge");
  };

  return (
    <div className={Style.Brand}>
      <div className={Style.Brand_box}>
        <div className={Style.Brand_box_left}>
          <Image
            src={the_forge}
            alt="MOH IMAGE"
            width={550}
            height={70}
            className={Style.Brand_box_left_img}
          />
          <h2>XDRIP MEDALS OF HONOR</h2>


          <div className={Style.Brand_box_left_box}>
            <small>Embark on a perilous journey to the Forge of Destiny,
              hidden within Xdripia's treacherous IronForge Mountains.
              Only the mightiest warriors dare to face its trials, proving their courage,
              strength, and unwavering loyalty. Become a legend and forge THE Medals of Honor,
              from common to legendary, representing your unparalleled bravery and honor.
              Will you rise above the rest and claim your place among the greatest heroes of all time?
            </small>
          </div>

          <div className={Style.Brand_box_left_btn}>
            {/*<ButtonSprite
              handleClick={handleButtonClick}
              btnName="ENTER"
              fontSize="22px"
              icon="/buttons/black_button_b2.png"
              imageWidth={225}
              imageHeight={48}              
              paddingRight="0px"
              paddingLeft="1.5rem"
            />*/}
            <ButtonSprite
              btnURL="/theForge" /* goes to this URL when clicked, e.g. router.push("/URL"); */
              btnSize="size2" /* adds a class to the .xbutton container: size1, size2, size3, original */
              btnText="ENTER" /* text inserted into span.xbutton-text */
              fontSize="default" /* if not "default" specify #px to make this override "font-size" property for span.xbutton-text in ButtonSprite.module.css */
              paddingLeft="64px" /* if not "default" specify #px to make this override "padding-left" property for span.xbutton-text in ButtonSprite.module.css */
              paddingRight="default" /* if not "default" specify #px to make this override "padding-right" property for span.xbutton-text in ButtonSprite.module.css */
              playSound="yes" /* yes/no to enable button click sound */
            />
          </div>
        </div>
        <div className={Style.Brand_box_right}>
          <Image
            src={moh_entry}
            alt="MOH IMAGE"
            width={700}
            height={750}
            className={Style.Brand_box_right_img}
          />
        </div>
      </div>
    </div>
  );
};

export default MOH;
