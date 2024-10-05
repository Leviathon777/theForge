import React from "react";
import Image from "next/image";
import {
  FaFacebookF,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import Link from 'next/link';

import { RiSendPlaneFill } from "react-icons/ri";

//INTERNAL IMPORT
import Style from "./Footer.module.css";
import logo  from "../../img/logo.png";
import { Discover, HelpCenter } from "../NavBar/index";

const Footer = () => {
  return (
    <div className={Style.footer}>
      <div className={Style.footer_box}>
        <div className={Style.footer_box_social}>
          <Image src={logo} alt="footer logo" />
          <p>Where digital art meets innovation</p>

          <div className={Style.footer_social}>
            <a href="https://www.facebook.com/TheXdripOfficial/">
              <FaFacebookF />
            </a>
            <a href="https://www.tiktok.com/@xdripofficial?lang=en">
              <FaTiktok />
            </a>
            <a href="https://twitter.com/XDRIP__">
              <FaTwitter />
            </a>
            <a href="https://www.youtube.com/channel/UCql_clMpK5GYxXUREIGfnRw">
              <FaYoutube />
            </a>
            <a href="https://www.instagram.com/thexdripofficial/">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className={Style.footer_box_discover}>
          <h3>XPLORE</h3>
          <Discover />
        </div>

        <div className={Style.footer_box_help}>
          <h3>SUPPORT</h3>
          <HelpCenter />
        </div>

        <div className={Style.subscribe}>
          <h3>SUBSCRIBE</h3>

          <div className={Style.subscribe_box}>
            <input type="email" placeholder="ENTER YOUR EMAIL" />
            <RiSendPlaneFill className={Style.subscribe_box_send} />
          </div>
          <div className={Style.subscribe_box_info}>
            <p>
              JOIN OUR GROWING XMARKET COMMUNITY TODAY!
            </p>
          </div>
          <div className={Style.footer_box_link}>
            <Link href="/legalEntry">
              <a><span className={Style.link_heading}>LEGAL LINKS</span></a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;