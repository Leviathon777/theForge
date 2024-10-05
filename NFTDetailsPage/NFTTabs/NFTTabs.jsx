import React from "react";
import Image from "next/image";

// INTERNAL IMPORT
import Style from "./NFTTabs.module.css";

const NFTTabs = ({ dataTab, icon, tabType }) => {
  return (



    // CODE FOR IF THE TAB IS SET TO PURCHASE HISTORY
    <div className={Style.NFTTabs_box} key={""}>
 {dataTab.length === 0 ? (
        <div>NO {tabType === "purchaseHistory" ? "PURCHASE HISTORY" : "data"} AVAILABLE</div>
      ) : (
        dataTab.map((transaction, index, dataArray) => {
          if (tabType === "purchaseHistory") {
            const createNFTData = transaction.createNFTData;
            const date = transaction.timestamp && new Date(transaction.timestamp.seconds * 1000);
            const dateString = date && date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return createNFTData ? (
              <div key={index}>
                {console.log("Transaction Data:", transaction)}
                <div className={Style.NFTTabs_box_info}>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TYPE:</p>
                    <span> {transaction.type} </span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TIMESTAMP:</p>
                    <span> {dateString} </span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p> NAME: </p>
                    <span>{createNFTData.name}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>PRICE:</p>
                    <span> {createNFTData.price} BNB </span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TO:</p>
                    <span>{createNFTData.to}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>FROM:</p>
                    <span>{createNFTData.from}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p> BLOCK #: </p>
                    <span>{transaction.blockHash}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TXN #:</p>
                    <span> {transaction.txHash} </span>
                  </div>

                </div>
              </div>
             ) : null;



            // CODE FOR IF THE TAB IS SET TO PROVENANCE
          } else if (tabType === "provenance") {
            const createNFTData = transaction.createNFTData;
            const date = transaction.timestamp && new Date(transaction.timestamp * 1000);
            const dateString = date && date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return createNFTData ? (
              <div key={index}>
                {console.log("Transaction Data:", transaction)}

                <div className={Style.NFTTabs_box_info}>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TYPE:</p>
                    <span> {transaction.type} </span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TIMESTAMP:</p>
                    <span> {dateString} </span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p> NAME: </p>
                    <span>{createNFTData.name}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>PRICE:</p>
                    <span>{(parseFloat(transaction.formattedPriceString) * 10 ** 9).toFixed(3)} BNB</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>IPFS:</p>
                    <span>{createNFTData.image}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p> BLOCK #: </p>
                    <span>{transaction.blockHash}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TXN #:</p>
                    <span> {transaction.txHash} </span>
                  </div>

                </div>
              </div>
            ) : null;



            // CODE FOR IF THE TAB IS SET TO OWNER
          } else if (tabType === "owner") {
            if (dataTab.length === 0) (<div>No {tabType === "owner" ? "owner" : "data"} available</div>)

            const createNFTData = transaction.createNFTData;
            const date = new Date(transaction.timestamp * 1000); // Note: No ".seconds" here
            const dateString = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            

            return createNFTData ? (
              <div key={index}>
                {console.log("Transaction Data OWNER:", transaction)}
                <div className={Style.NFTTabs_box_info}>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>OWNER:</p>
                    <span>{createNFTData.seller}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TIMESTAMP:</p>
                    <span> {dateString} </span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p> NAME: </p>
                    <span>{createNFTData.name}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p> CATEGORY: </p>
                    <span>{createNFTData.category}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p> WEBSITE: </p>
                    <span>{createNFTData.website}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p> BLOCK #: </p>
                    <span>{transaction.blockHash}</span>
                  </div>

                  <div className={Style.NFTTabs_box_info_info}>
                    <p>TXN #:</p>
                    <span> {transaction.txHash} </span>
                  </div>

                </div>
              </div>
             ) : null;
          }

          return null;
        })
      )}
    </div>
  );
};

export default NFTTabs;
