import React from 'react';
import styles from './SocialButtons.module.css';

const SocialButtons = () => {


  return (
    <div className={styles.BtnBox_main}>
      <div className={styles.BtnBox}>
        {/* XDRIP Button */}
        <a href={"https://www.xdrip.io"} target="_blank" rel="noopener noreferrer" title="XDRIP">
          <button className={styles.Btn}>
            <span className={styles.svgContainer}>
              <img
                src="/img/xdrip_social.png"
                alt="Twitter Icon"
                width="38px"
                height="38px"
              />
            </span>
            <span className={styles.BG}></span>
          </button>
        </a>
        {/* XTALES Button */}
        <a href={"https://www.talesofxdripia.com"} target="_blank" rel="noopener noreferrer" title="X-TALES">
          <button className={styles.Btn}>
            <span className={styles.svgContainer}>
              <img
                src="/img/tales_social.png"
                alt="Twitter Icon"
                width="38px"
                height="38px"
              />
            </span>
            <span className={styles.BG}></span>
          </button>
        </a>
        {/* X Community Button */}
        <a href={"https://x.com/i/communities/1829518910087180378"} target="_blank" rel="noopener noreferrer" title="X Community">
          <button className={styles.Btntwit}>
            <span className={styles.svgContainertwit}>
              <svg viewBox="0 0 512 512" height="2.4rem" xmlns="http://www.w3.org/2000/svg" className={styles.svgIcontwit} fill="white">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
              </svg>
            </span>
            <span className={styles.BGtwit}></span>
          </button>
        </a>

        {/* X Button */}
        <a href={"https://x.com/XDRIP"} target="_blank" rel="noopener noreferrer" title="X Main">
          <button className={styles.Btntwit}>
            <span className={styles.svgContainertwit}>
              <svg viewBox="0 0 512 512" height="2.4rem" xmlns="http://www.w3.org/2000/svg" className={styles.svgIcontwit} fill="white">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
              </svg>
            </span>
            <span className={styles.BGtwit}></span>
          </button>
        </a>


        {/* Instagram Button */}
        <a href={"https://www.instagram.com/thexdripofficial/"} target="_blank" rel="noopener noreferrer" title="Instagram">
          <button className={styles.Btninsta}>
            <span className={styles.svgContainerinsta}>
              <svg fill="white" className={styles.svgIconinsta} viewBox="0 0 448 512" height="2.5rem" xmlns="http://www.w3.org/2000/svg">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
              </svg>
            </span>
            <span className={styles.BGinsta}></span>
          </button>
        </a>

        {/* Facebook Button */}
        <a href={"https://www.facebook.com/TheXdripOfficial/"} target="_blank" rel="noopener noreferrer" title="Facebook">
          <button className={styles.Btnstock}>
            <span className={styles.svgContainerstock}>
              <svg viewBox="0 0 384 512" fill="white" height="2.2rem" xmlns="http://www.w3.org/2000/svg">
                <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"></path>
              </svg>
            </span>
            <span className={styles.BGstock}></span>
          </button>
        </a>
      </div>
    </div>
  );
};

export default SocialButtons;
