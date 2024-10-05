import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import NFTDetailsImg from "../NFTDetailsImg/NFTDetailsImg";
import ReportAbuseModal from "../../components/ReportAbuseModal.jsx"
import {
  MdVerified,
  MdCloudUpload,
  MdTimer,
  MdReportProblem,
  MdOutlineDeleteSweep,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet, FaPercentage } from "react-icons/fa";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialInstagram,
  TiSocialYoutube,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";
//INTERNAL IMPORT
import Style from "./NFTDescription.module.css";
import  xm_circle from "../../img/xm-circle.png";
import { Button } from "../../components/componentsindex.js";
import { NFTTabs } from "../NFTDetailsIndex";
//IMPORT SMART CONTRACT
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import { getUserProfile, getTransactionsByTokenIdFromFirebase, getCollectionDataWithName } from "../../firebase/services";
const NFTDescription = ({ nft }) => {
  console.log("NFT Object:", nft);
  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(true);
  const [provenance, setProvenance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [sellerUsername, setSellerUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [user, setUser] = useState("");
  const [facebook, setFacebook] = useState(null);
  const [tiktok, setTikTok] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [discord, setDiscord] = useState(null);
  const [fileType, setFileType] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [createTransactions, setCreateTransactions] = useState([]);
  const [purchaseTransactions, setPurchaseTransactions] = useState([]);
  const [sortByType, setSortByType] = useState('');
  const [dataArray, setDataArray] = useState([]);
  const router = useRouter();
  const [collectionData, setCollectionData] = useState({});
  const [createNFTTransactions, setCreateNFTTransactions] = useState([]);
  const [createAudioAssetTransactions, setCreateAudioAssetTransactions] = useState([]);
  const [createVideoAssetTransactions, setCreateVideoAssetTransactions] = useState([]);
  const closeSocialsButtons = () => {
    setSocial(false);
    setNFTMenu(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleReportSubmit = (reportData) => {
    console.log('Report submitted:', reportData);
  };
  // FETCHING ALL TRANSACTIONS BEFORE SORTING USING THE TOKEN ID 
  useEffect(() => {
    async function fetchTransactionsByTokenId() {
      try {
        const transactionsByTokenId = await getTransactionsByTokenIdFromFirebase(nft.tokenId);
        console.log('Transactions for tokenId', nft.tokenId, ':', transactionsByTokenId);
        setTransactions(transactionsByTokenId);
      } catch (error) {
        console.error('Error fetching transactions by tokenId:', error);
      }
    }
    fetchTransactionsByTokenId();
  }, [nft.tokenId]);
  // GRAB CREATE NFT DATA FROM THE TRANSACTION DATA
  useEffect(() => {
    const createNFTDataArray = transactions.map(transaction => transaction.createNFTData);
    setDataArray(createNFTDataArray);
  }, [transactions]);
  // SORT TRANSACTIONS BY THE "NFT SOLD TO USER" TYPE
  useEffect(() => {
    const purchaseTransactions = transactions.filter(transaction => transaction.type === "NFT SOLD TO USER");
    console.log('Purchase Transactions:', transactions);
    setPurchaseTransactions(purchaseTransactions);
  }, [transactions, sortByType]);
  // SORT TRANSACTIONS BY SPECIFIC TYPES
  useEffect(() => {
    const createNFTTransactions = transactions.filter(transaction => transaction.type === "CREATE NFT FOR SALE");
    const createAudioAssetTransactions = transactions.filter(transaction => transaction.type === "CREATE AUDIO ASSET FOR SALE");
    const createVideoAssetTransactions = transactions.filter(transaction => transaction.type === "CREATE VIDEO ASSET FOR SALE");
    setCreateNFTTransactions(createNFTTransactions);
    setCreateAudioAssetTransactions(createAudioAssetTransactions);
    setCreateVideoAssetTransactions(createVideoAssetTransactions);
    console.log('Create NFT transactions:', createNFTTransactions);
    console.log('Create Audio Asset transactions:', createAudioAssetTransactions);
    console.log('Create Video Asset transactions:', createVideoAssetTransactions);
  }, [transactions, sortByType]);
  const openSocial = () => {
    if (!social) {
      setSocial(true);
      setNFTMenu(false);
    } else {
      setSocial(false);
    }
  };
  const openNFTMenu = () => {
    if (!NFTMenu) {
      setNFTMenu(true);
      setSocial(false);
    } else {
      setNFTMenu(false);
    }
  };
  const openProvenance = () => {
    if (!provenance) {
      setOwner(false);
      setHistory(false);
      setProvenance(true);
    } else {
      setOwner(false);
      setHistory(false);
    }
  };
  const openHistory = () => {
    if (!history) {
      setOwner(false);
      setHistory(true);
      setProvenance(false);
    } else {
      setOwner(false);
      setHistory(false);
    }
  };
  const openOwner = () => {
    if (!owner) {
      setOwner(true);
      setHistory(false);
      setProvenance(false);
    } else {
      setOwner(false);
      setHistory(true);
    }
  };
  const handleMouseEnter = () => {
    setIsMenuHovered(true);
    clearTimeout(timeoutId);
  };

  const handleMouseLeave = () => {
    setIsMenuHovered(false);
    const newTimeoutId = setTimeout(() => {
      closeSocialsButtons();
    }, 70);
    setTimeoutId(newTimeoutId);
  };
  useEffect(() => {
    const fetchFileType = async () => {
      try {
        const response = await fetch(nft.image);
        const contentType = response.headers.get("content-type");
        setFileType(contentType);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFileType();
  }, [nft.image]);
  useEffect(() => {
    const fetchUserData = async () => {
      if (nft.seller) {
        const userData = await getUserProfile(nft.seller);
        console.log("Fetched user data:", userData); // Log the fetched user data
        setUser(userData);
      }
    };
    fetchUserData();
  }, [nft.seller]);
  //SMART CONTRACT DATA
  const { buyNFT, currentAccount } = useContext(NFTMarketplaceContext);
  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        // Check if transactions array is not empty
        if (transactions.length > 0) {
          // Determine the name (collectionName, albumName, or seriesName)
          let name;
          if (transactions[0].collectionName) {
            name = transactions[0].collectionName;
          } else if (transactions[0].albumName) {
            name = transactions[0].albumName;
          } else if (transactions[0].seriesName) {
            name = transactions[0].seriesName;
          } else {
            console.error('No valid name found in transactions.');
            return;
          }
          console.log('Fetching data for:', name);
          // Fetch the data based on the determined name
          const collectionData = await getCollectionDataWithName(name);
          if (collectionData) {
            console.log('Fetched data 2:', collectionData);
            // Handle data, e.g., set it to state
            setCollectionData(collectionData);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchCollectionData();
  }, [transactions]);
  return (
    <div className={Style.NFTDescription}>
      <div className={Style.NFTDescription_box}>
        <div className={Style.NFTDescription_box_share}>
          <p>{nft.category || nft.genre || "N/A"}</p>
          
          {user?.socials ? (
            <>
              <a href={user.socials.facebook || "#"} target="_blank" rel="noopener noreferrer">
                <TiSocialFacebook className={Style.icon} />
              </a>
              <a href={user.socials.instagram || "#"} target="_blank" rel="noopener noreferrer">
                <TiSocialInstagram className={Style.icon} />
              </a>
              <a href={user.socials.twitter || "#"} target="_blank" rel="noopener noreferrer">
                <TiSocialTwitter className={Style.icon} />
              </a>
              <a href={user.socials.discord || "#"} target="_blank" rel="noopener noreferrer">
                <TiSocialYoutube className={Style.icon} />
              </a>
            </>
          ) : (
            <p>No social links available</p>
          )}

          <div
            className={Style.NFTDescription_box_share_box}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <BsThreeDots
              className={Style.NFTDescription_box_share_box_icon}
              onClick={() => openNFTMenu()}
            />
            {NFTMenu && (
              <div
                className={Style.NFTDescription_box_share_box_social}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#" onClick={() => openModal()}>
                  <MdReportProblem /> REPORT ABUSE
                </a>
              </div>
            )}
          </div>
          <ReportAbuseModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleReportSubmit}
            tokenId={nft.tokenId}
          />
        </div>
      </div>
      {/* //Part TWO */}
      <div className={Style.NFTDescription_box_profile}>
        <h1>
          {nft.name}
        </h1>
        <div className={Style.NFTDescription_box_profile_box}>
          <div className={Style.NFTDescription_box_profile_box_left}>
            <img
              src={user?.profilePictureUrl}
              alt="Profile Pic"
              style={{ width: '60px', height: '60px' }}
              className={Style.NFTDetailsImg_box_details_box_profile_img}
            />
            <div className={Style.NFTDescription_box_profile_box_left_info}>
              <small>CREATOR</small> <br />
              <Link href={{ pathname: "/author" }}>
                <span>
                  {user?.username} <MdVerified />
                </span>
              </Link>
            </div>
          </div>
          <div className={Style.NFTDescription_box_profile_box_right}>
            <Image
              src={collectionData?.collectionImageUrl ?? collectionData?.albumImageUrl ?? collectionData?.seriesImageUrl ?? xm_circle}
              alt=""
              width={60}
              height={60}
              className={Style.NFTDescription_box_profile_box_left_img}
            />
            <div className={Style.NFTDescription_box_profile_box_right_info}>
              <small>COLLECTION TITLE</small> <br />
              {transactions.map((transaction, index) => (
                <div key={index}>
                  <span>
                    {transaction?.collectionName ? (
                      ` ${transaction.collectionName}`
                    ) : transaction.albumName ? (
                      ` ${transaction.albumName}`
                    ) : transaction.seriesName ? (
                      ` ${transaction.seriesName}`
                    ) : "NO COLLECTION"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={Style.NFTDescription_box_profile_biding}>
          <div className={Style.NFTDescription_box_profile_biding_box_timer}>
            <div className={Style.NFTDescription_box_profile_biding_box_timer_item}>
              <p>ASSET DESCRIPTION</p>
              <span>{nft.description}</span>
            </div>
            <div
              className={
                Style.NFTDescription_box_profile_biding_box_timer_item
              }
            >
              <p> {/* future auciton functionality */}</p>
              <span> {/* future auciton functionality */}</span>
            </div>
            <div
              className={
                Style.NFTDescription_box_profile_biding_box_timer_item
              }
            >
              <p> {/* future auciton functionality */}</p>
              <span> {/* future auciton functionality */}</span>
            </div>
            <div
              className={
                Style.NFTDescription_box_profile_biding_box_timer_item
              }
            >
              <p> {/* future auciton functionality */}</p>
              <span> {/* future auciton functionality */}</span>
            </div>
          </div>

          <div
            className={
              Style.NFTDescription_box_profile_biding_box_price
            }
          >
            <div className={Style.NFTDescription_box_profile_biding_box_price_bid}>
              <small>CURRENT PRICE</small>
              <p>{(parseFloat(nft.price) * 10 ** 9).toFixed(3)} BNB</p>
            </div>

            <span> {/* future Quantity functionality*/}</span>
          </div>

          <div
            className={
              Style.NFTDescription_box_profile_biding_box_button
            }
          >
            {currentAccount == nft.seller?.toLowerCase() ? (
              <p>YOU CAN'T BUY YOUR OWN ASSET</p>
            ) : currentAccount == nft.owner?.toLowerCase() ? (
              <Button
                icon={<FaWallet />}
                btnName="LIST ON MARKETPLACE"
                handleClick={() =>
                  router.push(
                    `/reSellToken?id=${nft.tokenId}&tokenURI=${nft.tokenURI}&price=${nft.price}`
                  )
                }
                classStyle={Style.button}
              />
            ) : (
              <Button
                icon="/buttons/black_button_b2.png"
                imageWidth={225}
                imageHeight={48}
                paddingRight="0px"
                paddingLeft="1.5rem"
                fontSize="18px"
                btnName="BUY ASSET"

                handleClick={() => buyNFT(nft)}
                classStyle={Style.button}
              />
            )}

            <Button
              handleClick={() => openHistory()}
              btnName="PURCHASE HISTORY"
              btnText="PURCHASE HISTORY"
              icon="/buttons/black_button_b3.png"
              imageWidth={275}
              imageHeight={48}
              paddingRight="0px"
              paddingLeft="1.75rem"
              fontSize="17px"
            />

          </div>

          <div
            className={
              Style.NFTDescription_box_profile_biding_box_tabs
            }
          >

            <Button
              handleClick={() => openOwner()}
              btnName="ASSET OWNER"
              icon="/buttons/black_button_b2.png"
              imageWidth={225}
              imageHeight={48}
              paddingRight="0px"
              paddingLeft="1.5rem"
              fontSize="17px"
            />

            <Button
              handleClick={() => openProvenance()}
              btnName=" ALL PROVENANCE"
              btnText="PROVENANCE"
              icon="/buttons/black_button_b3.png"
              imageWidth={275}
              imageHeight={48}
              paddingRight="0px"
              paddingLeft="1.5rem"
              fontSize="17px"
            />



          </div>

          {history && (
            <div
              className={
                Style.NFTDescription_box_profile_biding_box_card
              }
            >
              <NFTTabs dataTab={purchaseTransactions} tabType="purchaseHistory" />
            </div>
          )}
          {provenance && (
            <div
              className={
                Style.NFTDescription_box_profile_biding_box_card
              }
            >
              <NFTTabs dataTab={transactions} tabType="provenance" />
            </div>
          )}

          {owner && (
            <div
              className={
                Style.NFTDescription_box_profile_biding_box_card
              }
            >
              <NFTTabs dataTab={transactions} tabType="owner" />
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default NFTDescription;