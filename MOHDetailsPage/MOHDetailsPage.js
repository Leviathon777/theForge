import React from "react";

//INTERNAL IMPORT
import { MOHDescription, MOHDetailsImg, MOHTabs } from "./MOHDetailsIndex";
import Style from "./MOHDetailsPage.module.css";

const MOHDetailsPage = ({ nft }) => {
  return (
    <div >
      <div >
        <MOHDetailsImg nft={nft} />
        <MOHDescription nft={nft} />
      </div>
    </div>
  );
};

export default MOHDetailsPage;
