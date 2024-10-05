import React from "react";
import Link from "next/link";

import { isWalletConnected } from "../SideBar/SideBar";


//INTERNAL IMPORT
import Style from "./Create.module.css";

const Create = ({ isWalletConnected }) => {
  //--------CREATE NAVIGATION MENU
  const create = [
    {
      name: "ASSETS",
      link: "createButtonsPage",
    },
    {
      name: "COLLECTIONS",
      link: "createCollectionPage",
    },
    {
      name: "CREATORS",
      link: "becomeCreatorPage",
    },

  ];


  const filteredCreate = isWalletConnected
  ? create
  : create.filter((el) => el.name !== "CREATE");


  return (
    <div>
      {filteredCreate.map((el, i) => (
        <div key={i + 1} className={Style.discover}>

          <Link href={{ pathname: `/${el.link}` }}>{el.name}</Link>


        </div>
      ))}
    </div>
  );
};

export default Create;