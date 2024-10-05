import React from "react";
import Link from "next/link";

import { isWalletConnected } from "../SideBar/SideBar";


//INTERNAL IMPORT
import Style from "./Discover.module.css";

const Discover = ({ isWalletConnected }) => {
  //--------DISCOVER NAVIGATION MENU
  const discover = [
    {
      name: "CREATE",
      link: "createButtonsPage",
    }, 
    {
      name: "SEARCH",
      link: "searchPage",
    },
    {
      name: "THE FORGE",
      link: "theForge",
    },
    {
      name: "STUDIO X",
      link: "StudioX",
    },

  ];


  const filteredDiscover = isWalletConnected
  ? discover
  : discover.filter((el) => el.name !== "CREATE");


  return (
    <div>
      {filteredDiscover.map((el, i) => (
        <div key={i + 1} className={Style.discover}>
      
          {/*
          <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
          */}

          <Link href={{ pathname: `/${el.link}` }}>{el.name}</Link>


        </div>
      ))}
    </div>
  );
};

export default Discover;