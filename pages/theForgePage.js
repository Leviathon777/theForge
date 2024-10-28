import React, { useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import NFTWallet from "../components/NFTWallet/NFTWallet";
import { Button, SocialButtons, TheForge, TermsOfService, UserAgreement, WalkthroughModal } from "../components/componentsindex";
import MyNFTData from "../Context/MyNFTDataContext";
import Style from "../styles/theForge.module.css";
import { useSigner, useAddress } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Link from 'next/link';


const TheForgePage = () => {
  const [bnbPrice, setBnbPrice] = useState(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const signer = useSigner();
  const address = useAddress();
  const router = useRouter();


  useEffect(() => {
    const fetchBNBPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
        const data = await response.json();
        setBnbPrice(data.binancecoin.usd);
      } catch (error) {
        console.error("Failed to fetch BNB price:", error);
      }
    };
    fetchBNBPrice();
  }, []);

  useEffect(() => {
    const checkOwner = async () => {
      if (!signer || !address) return;

      try {
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_MEDAL_CONTRACT_ADDRESS,
          require('../Context/mohCA_ABI.json').abi,
          signer
        );

        const contractOwner = await contract.owner();
        const authorizedAddresses = process.env.NEXT_PUBLIC_OWNER_ADDRESSES?.split(",").map(addr => addr.trim().toLowerCase()) || [];

        if (
          address.toLowerCase() === contractOwner.toLowerCase() ||
          authorizedAddresses.includes(address.toLowerCase())
        ) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (error) {
        console.error("Error checking owner:", error);
      }
    };

    if (signer && address) {
      checkOwner();
    }
  }, [signer, address]);

  const handleNavigation = () => {
    console.log("Navigating to /OwnerOpsPage...");
    router.push('/OwnerOpsPage').catch(err => console.error("Navigation error:", err));
  };

  return (
    <div className={Style.theForge}>
      <div className={Style.theForge_content}>
        <div className={Style.theForge_content_wrapper}>
          <h1 className={Style.title_text}>THE FORGE OF DESTINY</h1>
        </div>
        <div className={Style.theForgeContent}>
          <h1 className={Style.lore_text}>A LEGENDS LORE</h1>
          <p className={Style.medalsText}>
            In the mythical land of Xdripia, a beacon of courage and relentless perseverance stands above all else:
            <strong> The Forge of Destiny</strong>. This revered place, shrouded in mystery, is the ultimate arena
            where only the most steadfast and fearless warriors dare to tread. Here, champions face brutal trials,
            their mettle tested against both the elements and the fierce legacy of those who came before. This journey
            is not simply for glory but is a proving ground for the heart, strength, and unwavering loyalty to the
            people of Xdripia.
            <br />
            <br />
            Nestled within the unforgiving, jagged peaks of the IronForge Mountains, The Forge of Destiny remains
            hidden from those not called by destiny. The journey alone is the first trial—an arduous trek through
            treacherous ravines and chilling winds designed to strip away any pretenders. Only those with resilience
            in their hearts and fire in their spirits will emerge at the gates of the Forge, ready to face the
            ordeals within.
            <br />
            <br />
            The warriors who make it to the Forge are tasked with surviving a series of increasingly formidable
            challenges. Each test pushes them to the edge of their abilities, testing not only their strength but
            their courage, wisdom, and loyalty. These trials are set by the ancient guardians of Xdripia, remnants
            of an era when the land faced its greatest perils, including betrayal from within.
            <br />
            <br />
            In these dark times, Xdripia has seen betrayal from allies, sabotage from within, and the relentless
            assault of the Caller Syndicate—a ruthless coalition of traitors who seek to tear apart the unity of
            Xdripia. The Syndicate's attacks have left scars on both the land and its people. But with every strike
            from the enemy, the Forge produces a new champion, a beacon of hope to rally the people.
            <br />
            <br />
            For the few who emerge victorious from this sacred place, they earn more than glory—they earn the right
            to forge the <strong>Medal of Honor</strong>. This medal is a sacred symbol, imbued with the memories
            of battles fought, and a promise to guard Xdripia against all foes, external and internal. Each medal
            represents not just a battle but a personal sacrifice and the resilience of those who fight for the
            freedom of Xdripia. Its existence binds the warrior to the ancient duty of defending their homeland,
            marking them among the most uncommon, rare, epic, and legendary heroes in history.
          </p>
        </div>
        <div className={Style.glowingDivider}></div>
        <MyNFTData>
          <div className={Style.second_component}>
            <h1 className={Style.lore_text}>MEDALS OF HONOR VAULT</h1>
            <TheForge setIsModalOpen={setIsModalOpen} />
          </div>
          <div className={Style.glowingDivider}></div>
          <div className={Style.third_component}>
            <h1 className={Style.lore_text}>YOUR MEDALS DISPLAY CASE</h1>
            <NFTWallet />
          </div>
          <div className={Style.glowingDivider}></div>
          <div className={Style.fourth_component}>
            <h1 className={Style.lore_text}>A WARRIOR'S SPOILS</h1>
            <HTMLFlipBook
              width={500}
              height={700}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={700}
              maxHeight={1000}
              maxShadowOpacity={0.5}
              className={Style.flipBook}
              drawShadow={false}
              flippingTime={1000}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              mobileScrollSupport={false}
            >
              <div className={Style.page}>
                <div className={Style.page_image_top}>
                  <img src="/img/metal.webp" alt="Image 2" className={Style.image_front} />
                </div>
              </div>
              <div className={Style.content_page}>
                <h2>Table of Contents</h2>
                <ul className={Style.contentsList}>
                  <li><span className={Style.title}>Common Tier Image</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 1</span></li>
                  <li><span className={Style.title}>Common Tier Details</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 2</span></li>
                  <li><span className={Style.title}>Uncommon Tier Image</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 3</span></li>
                  <li><span className={Style.title}>Uncommon Tier Details</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 4</span></li>
                  <li><span className={Style.title}>Rare Tier Image</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 5</span></li>
                  <li><span className={Style.title}>Rare Tier Details</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 6</span></li>
                  <li><span className={Style.title}>Epic Tier Image</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 7</span></li>
                  <li><span className={Style.title}>Epic Tier Details</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 8</span></li>
                  <li><span className={Style.title}>Legendary Tier Image</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 9</span></li>
                  <li><span className={Style.title}>Legendary Tier Details</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 10</span></li>
                  <li><span className={Style.title}>Eternal Tier Image</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 11</span></li>
                  <li><span className={Style.title}>Eternal Tier Details</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 12</span></li>
                  <li><span className={Style.title}>XDRIP Holder Benefits</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 13</span></li>
                  <li><span className={Style.title}>Additional XDRIP Benefits</span><span className={Style.leader}></span><span className={Style.pageNumber}>Page 14</span></li>
                </ul>
              </div>



              <div className={Style.page_left}>
                <div className={Style.page_left_wrapper}>
                  <div className={Style.page_left_top}>
                    <img src="/img/nft-image-1.webp" alt="Image 1" className={Style.imagePage} />
                  </div>
                  <div className={Style.page_left_bottom}>
                    <h1>I. COMMON TIER</h1>
                    <p className={Style.supply}>Supply: 10,000 Medals</p>
                    <p className={Style.price}>
                      Price: 0.5 BNB
                      {bnbPrice && (
                        <span title="0.5 BNB to USD">
                          &nbsp;| {`~$${(0.5 * bnbPrice).toLocaleString()} USD`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>


              <div className={Style.page}>
                <div className={Style.page_left_wrapper}>
                  <ul className={Style.benefits}>
                    <li><strong>Revenue Pool Access:</strong>
                      <ul>
                        <li>10% share of the revenue pool, the foundation of financial returns.</li>
                      </ul>
                    </li>
                    <li><strong>Tokenization Access:</strong>
                      <ul>
                        <li>Early Insights - Receive early insights on upcoming tokenized projects, along with exclusive updates on new opportunities.</li>
                      </ul>
                    </li>
                    <li><strong>Event Access:</strong>
                      <ul>
                        <li>Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements</li>
                        <li>Livestream access to main events hosted by the company, including keynotes and announcements.</li>
                      </ul>
                    </li>
                    <li><strong>Unlocks XDRIP Holder Bonus:</strong> 0.50% XDRIP Tokens Supply
                      <ul>
                        <li>Early Insights - Receive early insights on upcoming tokenized projects, along with exclusive updates on new opportunities.</li>
                      </ul>
                    </li>
                    <li><strong>Collectible Perks:</strong>
                      <ul>
                        <li>Quarterly distribution of digital artwork and collectibles from partner collaborations.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>



              <div className={Style.page_left}>
                <div className={Style.page_left_wrapper}>
                  <div className={Style.page_left_top}>
                    <img src="/img/nft-image-2.webp" alt="Image 2" className={Style.imagePage} />
                  </div>
                  <div className={Style.page_left_bottom}>
                    <h1>II. UNCOMMON TIER</h1>
                    <p className={Style.supply}>Supply: 5,000 Medals</p>
                    <p className={Style.price}>
                      Price: 1.0 BNB
                      {bnbPrice && (
                        <span title="1.0 BNB to USD">
                          &nbsp;| {`~$${(1.0 * bnbPrice).toLocaleString()} USD`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>



              <div className={Style.page}>
                <div className={Style.page_left_wrapper}>
                  <ul className={Style.benefits}>
                    <li><strong>Revenue Pool Access:</strong>
                      <ul>
                        <li>25% cumulative revenue share, increasing financial returns.</li>
                      </ul>
                    </li>
                    <li><strong>Tokenization Access:</strong>
                      <ul>
                        <li>First-round invitations to participate in tokenized projects with a 5% discount on token purchase fees.</li>
                      </ul>
                    </li>
                    <li><strong>Event Access:</strong>
                      <ul>
                        <li>Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements</li>
                        <li>Livestream access to main events hosted by the company, including keynotes and announcements</li>
                        <li>Priority on tickets for events and discounts on travel packages for attendees.</li>
                      </ul>
                    </li>
                    <li><strong>Unlocks XDRIP Holder Bonus:</strong> 1.00% XDRIP Tokens Supply
                      <ul>
                        <li>5% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                    <li><strong>Collectible Perks:</strong>
                      <ul>
                        <li>Quarterly distribution of digital artwork and collectibles from partner collaborations.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>



              <div className={Style.page_left}>
                <div className={Style.page_left_wrapper}>
                  <div className={Style.page_left_top}>
                    <img src="/img/nft-image-3.webp" alt="Image 3" layout="fill" className={Style.imagePage} />
                  </div>
                  <div className={Style.page_left_bottom}>
                    <h1>III. RARE TIER</h1>
                    <p className={Style.supply}>Supply: 2,500 Medals</p>
                    <p className={Style.price}>
                      Price: 1.5 BNB
                      {bnbPrice && (
                        <span title="1.5 BNB to USD">
                          &nbsp;| {`~$${(1.5 * bnbPrice).toLocaleString()} USD`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>


              <div className={Style.page}>
                <div className={Style.page_left_wrapper}>
                  <ul className={Style.benefits}>
                    <li><strong>Revenue Pool Access:</strong>
                      <ul>
                        <li>45% of the revenue pool, creating substantial financial rewards.</li>
                      </ul>
                    </li>
                    <li><strong>Tokenization Access:</strong>
                      <ul>
                        <li>10% discount on token fees and priority access to fractionalized ownership projects such as small homes or premium rentals.</li>
                      </ul>
                    </li>
                    <li><strong>Event Access:</strong>
                      <ul>
                        <li>Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements</li>
                        <li>Livestream access to main events hosted by the company, including keynotes and announcements</li>
                        <li>Priority on tickets for events and discounts on travel packages for attendees.</li>
                        <li>One free ticket per year to any company-hosted event.</li>
                      </ul>
                    </li>
                    <li><strong>Revenue Statement:</strong>
                      <ul>
                        <li>Personalized quarterly reports on platform performance, projections, and revenue growth.</li>
                      </ul>
                    </li>
                    <li><strong>Community Voting:</strong>
                      <ul>
                        <li>Voting rights on company-driven initiatives and new tokenization projects.</li>
                      </ul>
                    </li>
                    <li><strong>Unlocks XDRIP Holder Bonus:</strong> 1.50% XDRIP Tokens Supply
                      <ul>
                        <li>7% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                    <li><strong>Collectible Perks:</strong>
                      <ul>
                        <li>Quarterly distribution of digital collectibles from partner collaborations.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>



              <div className={Style.page_left}>
                <div className={Style.page_left_wrapper}>
                  <div className={Style.page_left_top}>
                    <img src="/img/nft-image-4.webp" alt="Image 4" layout="fill" className={Style.imagePage} />
                  </div>
                  <div className={Style.page_left_bottom}>
                    <h1>IV. EPIC TIER</h1>
                    <p className={Style.supply}>Supply: 1,000 Medals</p>
                    <p className={Style.price}>
                      Price: 2.0 BNB
                      {bnbPrice && (
                        <span title="2.0 BNB to USD">
                          &nbsp;| {`~$${(2.0 * bnbPrice).toLocaleString()} USD`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>


              <div className={Style.page}>
                <div className={Style.page_left_wrapper}>
                  <ul className={Style.benefits}>
                    <li><strong>Revenue Pool Access:</strong>
                      <ul>
                        <li>70% of the revenue pool, establishing a high-tier investment.</li>
                      </ul>
                    </li>
                    <li><strong>Tokenization Access:</strong>
                      <ul>
                        <li>Enhanced Discounts and Priority Access - Enjoy a 10% discount on token fees and priority access to fractionalized ownership projects, such as small homes or premium rentals.</li>
                      </ul>
                    </li>
                    <li><strong>Event Access:</strong>
                      <ul>
                        <li>Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements</li>
                        <li>Livestream access to main events hosted by the company, including keynotes and announcements</li>
                        <li>Priority on tickets for events and discounts on travel packages for attendees.</li>
                        <li>One free ticket per year to any company-hosted event, with VIP seating.</li>
                      </ul>
                    </li>
                    <li><strong>Revenue Statement:</strong>
                      <ul>
                        <li>Personalized quarterly reports on platform performance, projections, and revenue growth.</li>
                      </ul>
                    </li>
                    <li><strong>Community Voting:</strong>
                      <ul>
                        <li>Voting rights on company-driven initiatives and new tokenization projects.</li>
                      </ul>
                    </li>
                    <li><strong>Unlocks XDRIP Holder Bonus:</strong> 2.00% XDRIP Tokens Supply
                      <ul>
                        <li>10% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                    <li><strong>Collectible Perks:</strong>
                      <ul>
                        <li>Quarterly distribution of digital collectibles from partner collaborations.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>



              <div className={Style.page_left}>
                <div className={Style.page_left_wrapper}>
                  <div className={Style.page_left_top}>
                    <img src="/img/nft-image-5.webp" alt="Image 5" layout="fill" className={Style.imagePage} />
                  </div>
                  <div className={Style.page_left_bottom}>
                    <h1>V. LEGENDARY TIER</h1>
                    <p className={Style.supply}>Supply: 500 Medals</p>
                    <p className={Style.price}>
                      Price: 2.5 BNB
                      {bnbPrice && (
                        <span title="2.5 BNB to USD">
                          &nbsp;| {`~$${(2.5 * bnbPrice).toLocaleString()} USD`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>



              <div className={Style.page}>
                <div className={Style.page_left_wrapper}>
                  <ul className={Style.benefits}>
                    <li><strong>Revenue Pool Access:</strong>
                      <ul>
                        <li>100% cumulative revenue share.</li>
                        <li>10% multiplier on annual revenue upon full-tier completion.</li>
                      </ul>
                    </li>
                    <li><strong>Tokenization Access:</strong>
                      <ul>
                        <li>Premium Discounts and Investment Rights - Benefit from a 20% discount on purchase fees for high-demand tokenized projects and receive the first right of refusal on premium investments.</li>
                      </ul>
                    </li>
                    <li><strong>Event Access:</strong>
                      <ul>
                        <li>Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements</li>
                        <li>Livestream access to main events hosted by the company, including keynotes and announcements</li>
                        <li>Priority on tickets for events and discounts on travel packages for attendees.</li>
                        <li>One free ticket per year to any company-hosted event, with VIP seating and lounge access.</li>
                      </ul>
                    </li>
                    <li><strong>Revenue Statement:</strong>
                      <ul>
                        <li>Personalized quarterly reports on platform performance, projections, and revenue growth.</li>
                      </ul>
                    </li>
                    <li><strong>Community Voting:</strong>
                      <ul>
                        <li>Voting rights on company-driven initiatives and new tokenization projects.</li>
                      </ul>
                    </li>
                    <li><strong>Unlocks XDRIP Holder Bonus:</strong> 2.50% XDRIP Tokens Supply
                      <ul>
                        <li>15% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                    <li><strong>Collectible Perks:</strong>
                      <ul>
                        <li>Quarterly distribution of digital collectibles from partner collaborations.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>




              <div className={Style.page_left}>
                <div className={Style.page_left_wrapper}>
                  <div className={Style.page_left_top}>
                    <img src="/img/nft-image-6.webp" alt="Image 5" layout="fill" className={Style.imagePage} />
                  </div>
                  <div className={Style.page_left_bottom}>
                    <h1>VI. ETERNAL TIER</h1>
                    <p className={Style.supply}>Supply: 20 Medals</p>
                    <p className={Style.price}>
                      Price: 200 BNB
                      {bnbPrice && (
                        <span title="200 BNB to USD">
                          &nbsp;| {`~$${(200 * bnbPrice).toLocaleString()} USD`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>



              <div className={Style.page}>
                <div className={Style.page_left_wrapper}>
                  <ul className={Style.benefits}>
                    <li><strong>Revenue Pool Access:</strong>
                      <ul>
                        <li>100% cumulative revenue share.</li>
                        <li>10% multiplier on annual revenue upon full-tier completion.</li>
                      </ul>
                    </li>
                    <li><strong>Tokenization Access:</strong>
                      <ul>
                        <li>Premium Discounts and Investment Rights - Benefit from a 20% discount on purchase fees for high-demand tokenized projects and receive the first right of refusal on premium investments.</li>
                      </ul>
                    </li>
                    <li><strong>Event Access:</strong>
                      <ul>
                        <li>Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements</li>
                        <li>Livestream access to main events hosted by the company, including keynotes and announcements</li>
                        <li>Priority on tickets for events and discounts on travel packages for attendees.</li>
                        <li>One free ticket per year to any company-hosted event, with VIP seating and lounge access.</li>
                      </ul>
                    </li>
                    <li><strong>Revenue Statement:</strong>
                      <ul>
                        <li>Personalized quarterly reports on platform performance, projections, and revenue growth.</li>
                      </ul>
                    </li>
                    <li><strong>Community Voting:</strong>
                      <ul>
                        <li>Voting rights on company-driven initiatives and new tokenization projects.</li>
                      </ul>
                    </li>
                    <li><strong>Unlocks XDRIP Holder Bonus:</strong> 2.50% XDRIP Tokens Supply
                      <ul>
                        <li>15% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                    <li><strong>Collectible Perks:</strong>
                      <ul>
                        <li>Quarterly distribution of digital collectibles from partner collaborations.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>




              <div className={Style.page}>
              </div>
              <div className={Style.page}>
                <div className={Style.page_left_wrapper_bottom}>
                  <h2 className={Style.page_left_wrapper_text}>XDRIP Holder Benefits AND Incentives</h2>
                  <p className={Style.page_p}>
                    To encourage holders to invest in both NFTs and XDRIP, we offer unique bonuses for those who reach specific XDRIP thresholds, starting at 1% supply. These bonuses compound with each tier, adding up to 15% additional returns for holders of 5% of the total supply:
                  </p>
                  <ul className={Style.benefits}>
                    <li><strong>Own Common Tier + 0.5% Supply XDRIP Tokens:</strong>
                      <ul>
                        <li>Early Insights - Receive early insights on upcoming tokenized projects, along with exclusive updates on new opportunities.</li>
                      </ul>
                    </li>
                    <li><strong>Own UnCommon Tier + 1.0% Supply XDRIP Tokens:</strong>
                      <ul>
                        <li>5% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                    <li><strong>Own Rare Tier + 1.5% Supply XDRIP Tokens:</strong>
                      <ul>
                        <li>7% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                    <li><strong>Own Epic Tier + 2.0% Supply XDRIP Tokens:</strong>
                      <ul>
                        <li>10% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                    <li><strong>Own Legendary Tier + 2.5% Supply XDRIP Tokens:</strong>
                      <ul>
                        <li>15% revenue share bonus.</li>
                        <li>Priority seating at company events.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </HTMLFlipBook>
          </div>
          <div className={Style.glowingDivider}></div>
          <div className={Style.fifth_component}>
            <SocialButtons />
            <div className={Style.button_botton_box}>
              <Button
                btnName="Terms of Service"
                onClick={() => setIsTermsModalOpen(true)}
                fontSize="inherit"
                paddingLeft="0"
                paddingRight="0"
                isActive={false}
                setIsActive={() => { }}
                title="Terms of Service"
              />
              <Button
                btnName="User Agreement"
                onClick={() => setIsUserAgreementModalOpen(true)}
                fontSize="inherit"
                paddingLeft="0"
                paddingRight="0"
                isActive={false}
                setIsActive={() => { }}
                title="User Agreement"
              />
              {isOwner && (
                <Button
                  btnName="Owner Operations"
                  onClick={handleNavigation}
                  fontSize="inherit"
                  paddingLeft="0"
                  paddingRight="0"
                  isActive={false}
                  setIsActive={() => { }}
                  title="Go to OwnerOps"
                />
              )}
            </div>
            <TermsOfService
              isOpen={isTermsModalOpen}
              onRequestClose={() => setIsTermsModalOpen(false)}
            />
            <UserAgreement
              isOpen={isUserAgreementModalOpen}
              onRequestClose={() => setIsUserAgreementModalOpen(false)}
            />
            <WalkthroughModal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
            />
          </div>
        </MyNFTData>
      </div >
    </div >
  );
};
export default TheForgePage;
