import React, { useState, useEffect, useRef, memo, forwardRef } from "react";
import { motion } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import DotWallet from "../components/DotWallets/DotWallet";
import { Button, SocialButtons, TheForge, TermsOfService, UserAgreement } from "../components/componentsindex";
import MyDotData from "../Context/MyDotDataContext";
import Style from "../styles/theForge.module.css";
import { useSigner, useAddress } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';


const PageComponent = memo(
  forwardRef(({ pageContent, pageIndex, bnbPrice }, ref) => {
    const pageClass =
      pageIndex === 0 ? Style.cover :
        pageIndex === 1 ? Style.dedication :
          pageIndex === 2 ? Style.contents_page :
            (pageIndex - 3) % 4 === 0 ? Style.page_left :
              (pageIndex - 3) % 4 === 1 ? Style.page_right :
                (pageIndex - 3) % 4 === 2 ? Style.page_left :
                  Style.page_right;
    return (
      <div ref={ref} className={pageClass}>
        <div className={Style.pageWrapper}>
          <div className={Style.page_inner}>
            {pageIndex === 1 ? (
              <div className={Style.dedicationContent}>
                <div className={Style.dedicationBottom}>
                  <p className={Style.dedicationText}>{pageContent.description}</p>
                </div>
              </div>
            ) : (
              <>
                <div className={Style.page_upper}>
                  <div className={Style.page_inner_image}>
                    {pageContent.imageSrc && (
                      <img
                        src={pageContent.imageSrc}
                        alt={pageContent.title}
                        className={`${Style.imagePage} ${pageClass === Style.cover ? Style.coverImageFull : ""}`}

                      />
                    )}
                  </div>
                </div>
                <div className={`${Style.page_lower} ${pageIndex === 0 ? Style.hideTitle : ""}`}>
                  <h1 className={Style.pageContent_title}>{pageContent.title}</h1>
                  {pageContent.supply && <p className={Style.supply}>Supply: {pageContent.supply}</p>}
                  {pageContent.price && (
                    <p className={Style.price}>
                      Price: {pageContent.price} BNB
                      {bnbPrice && (
                        <span title={`${pageContent.price} BNB to USD`}>
                          &nbsp;| ~${(pageContent.price * bnbPrice).toLocaleString()} USD
                        </span>
                      )}
                    </p>
                  )}
                </div>
                {pageContent.benefits && (
                  <ul className={Style.benefits}>
                    {pageContent.benefits.map((benefit, i) => (
                      <li key={i}>
                        <strong>{benefit.title}:</strong>
                        {Array.isArray(benefit.description) ? (
                          benefit.description.map((desc, index) => (
                            <p key={index} className={Style.benefit_description}>{desc}</p>
                          ))
                        ) : (
                          <p className={Style.benefit_description}>{benefit.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {pageContent.contents && (
                  <ul className={Style.contentsList}>
                    {pageContent.contents.map((content, i) => (
                      <li key={i}>
                        <span className={Style.contentTitle}>{content.title}</span>
                        <span className={Style.pageNumber}>{content.page}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          {pageIndex > 2 && <div className={Style.pageNumber}>Page {pageIndex - 2}</div>}
        </div>
      </div>
    );
  })
);
const TheForgePage = () => {
  const [bnbPrice, setBnbPrice] = useState(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const signer = useSigner();
  const address = useAddress();
  const router = useRouter();
  const pageRefs = useRef([]);

  const handleFlip = (e) => {
    const currentPage = e.data;
    if (currentPage === 0) {
      setIsBookOpen(false);
      console.log("Book is closed.");
    } else {
      setIsBookOpen(true);
      console.log("Book is open.");
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    router.push('/OwnerOpsPage').catch(err => console.error("Navigation error:", err));
  };
  const pages = [
    { title: "", imageSrc: "/img/book_background.png" },
    {
      title: "",
      description: (
        <>
          <div className={Style.dedicationContainer}>
            <h2 className={Style.dedicationTitle}>To Our Unbreakable Community</h2>
            <div className={Style.dedicationPages}>
              <div className={Style.dedicationPage}>
                <p className={Style.dedicationParagraph}>
                  This is for you—the loyal, rock-solid holders who have stood by us through every high and low. The Medals of Honor are our tribute to you, to your belief in us when we were tested, to the strength of your support that lifted us up and carried us forward. You’ve been more than a community; you are our family, the very heartbeat of everything we’ve built, and you deserve all the gratitude and honor we can give.
                </p>
              </div>
              <div className={Style.dedicationPage}>
                <p className={Style.dedicationParagraph}>
                  We remember the times when the path grew dark. Not only did the Caller Syndicate try to tear us down, but two of our own team members betrayed us, challenging everything we had worked for. But through it all, you stayed. You believed. Your unwavering dedication gave us the courage to rise above every challenge. Because of you, we didn’t just survive—we thrived. Today, our businesses are reaching new heights, our vision is expanding, and our future looks brighter than ever, all thanks to your steadfast loyalty and unbreakable faith.
                </p>
              </div>
              <div className={Style.dedicationPage}>
                <p className={Style.dedicationParagraph}>
                  These Medals are more than symbols; they carry the story of resilience, unity, and the powerful loyalty that you showed us. They honor those who stayed true, who believed in a vision bigger than any setback, and who have been with us through every step of this journey. They are for you, and for those who will join us, inspired by your example to become part of something extraordinary.
                </p>
              </div>
              <div className={Style.dedicationPage}>
                <p className={Style.dedicationParagraph}>
                  As we look to the future, these Medals represent the legacy we are building together. They are a promise to each of you—a promise that we will continue to grow, to innovate, and to honor the incredible support you have given us. For those who join us next, may they learn from the strength of this community and feel the depth of commitment that each Medal represents.
                </p>
              </div>
              <div className={Style.dedicationPage}>
                <p className={Style.dedicationParagraph}>
                  From the depths of our hearts, thank you. Thank you for standing by us, for fighting with us, and for believing in a vision that grows brighter every day because of you. We are endlessly grateful to have each of you with us, not just as holders, but as true partners in this dream.
                </p>
              </div>
              <div className={Style.dedicationPage}>
                <p className={Style.dedicationParagraph}>
                  To all of you, with all that we have: here’s to the future, to your future, and to the legacy we are building together. You are the soul of this project, the reason we strive, and the family we are so proud to have by our side.
                </p>
              </div>
              <p className={Style.dedicationSignature}>
                With all our love, gratitude, and admiration,<br />
                Brad, Jim, Flo, Jordi & Amos
              </p>
            </div>
          </div>

        </>
      )
    },
    {
      title: "Table of Contents",
      contents: [
        { title: "Common Tier Image", page: "Page 3" },
        { title: "Common Tier Details", page: "Page 4" },
        { title: "Uncommon Tier Image", page: "Page 5" },
        { title: "Uncommon Tier Details", page: "Page 6" },
        { title: "Rare Tier Image", page: "Page 7" },
        { title: "Rare Tier Details", page: "Page 8" },
        { title: "Epic Tier Image", page: "Page 9" },
        { title: "Epic Tier Details", page: "Page 10" },
        { title: "Legendary Tier Image", page: "Page 11" },
        { title: "Legendary Tier Details", page: "Page 12" },
        { title: "Eternal Tier Image", page: "Page 13" },
        { title: "Eternal Tier Details", page: "Page 14" },
        { title: "XDRIP Holder Benefits", page: "Page 15" },
        { title: "Additional XDRIP Benefits", page: "Page 16" }
      ]
    },
    { title: "Common Tier", imageSrc: "/img/common.png", supply: "10,000 Medals", price: 0.5 },
    {
      title: "Common Tier Benefits", benefits: [
        { title: "Revenue Pool Access", description: "10% share of the revenue pool, the foundation of financial returns." },
        { title: "Tokenization Access", description: "Receive early insights on upcoming tokenized projects." },
        {
          title: "Event Access",
          description: [
            "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements.",
            "Livestream access to main events hosted by the company, including keynotes and announcements."
          ]
        },
        {
          title: "Unlocks XDRIP Holder Bonus",
          description: [
            "Must hold atleast (0.5%) XDRIP token supply.",
            "2% revenue share bonus"
          ]
        },
      ]
    },
    { title: "Uncommon Tier", imageSrc: "/img/uncommon.png", supply: "5,000 Medals", price: 1.0 },
    {
      title: "Uncommon Tier Benefits", benefits: [
        { title: "Revenue Pool Access", description: "25% cumulative revenue share, increasing financial returns." },
        { title: "Tokenization Access", description: "Receive early insights on upcoming tokenized projects." },
        {
          title: "Event Access",
          description: [
            "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements.",
            "Livestream access to main events hosted by the company, including keynotes and announcements.",
            "Priority on tickets for events and discounts on travel packages for attendees."
          ]
        },
        {
          title: "Unlocks XDRIP Holder Bonus",
          description: [
            "Must hold atleast (1.0%) XDRIP token supply.",
            "5% revenue share bonus.",
            "Priority seating at company events."
          ]
        },
      ]
    },
    { title: "Rare Tier", imageSrc: "/img/rare.png", supply: "2,500 Medals", price: 1.5 },
    {
      title: "Rare Tier Benefits", benefits: [
        { title: "Revenue Pool Access", description: "45% of the revenue pool, creating substantial financial rewards." },
        { title: "Tokenization Access", description: "10% discount on purchase fees for high-demand tokenized projects." },
        {
          title: "Event Access",
          description: [
            "Exclusive offers on XdRiP Fly Block and Hotel Reservations.",
            "Livestream access to main events hosted by the company, including keynotes and announcements.",
            "Priority tickets for events and discounts on event travel packages.",
            "One free ticket per year to any company-hosted event, with VIP seating and lounge access."
          ]
        },
        { title: "Revenue Statement", description: "Personalized quarterly reports on platform performance and growth." },
        { title: "Community Voting", description: "Voting rights on companyinitiatives and new tokenization projects" },
        {
          title: "Unlocks XDRIP Holder Bonus", description: [
            "Must hold atleast (1.5%) XDRIP token supply.",
            "7% revenue share bonus.",
            "Priority seating at company events."
          ]
        },
      ]
    },



    { title: "Epic Tier", imageSrc: "/img/epic.png", supply: "1,000 Medals", price: 2.0 },
    {
      title: "Epic Tier Benefits", benefits: [
        { title: "Revenue Pool Access", description: "70% of the revenue pool, establishing a high-tier investment." },
        { title: "Tokenization Access", description: "10% discount on purchase fees for high-demand tokenized projects." },
        {
          title: "Event Access",
          description: [
            "Exclusive offers on XdRiP Fly Block and Hotel Reservations.",
            "Livestream access to main events hosted by the company, including keynotes and announcements.",
            "Priority tickets for events and discounts on event travel packages.",
            "One free ticket per year to any company-hosted event, with VIP seating and lounge access."
          ]
        },
        { title: "Revenue Statement", description: "Personalized quarterly reports on platform performance and growth." },
        { title: "Community Voting", description: "Voting rights on companyinitiatives and new tokenization projects" },
        {
          title: "Unlocks XDRIP Holder Bonus", description: [
            "Must hold atleast (2.0%) XDRIP token supply.",
            "10% revenue share bonus.",
            "Priority seating at company events."
          ]
        },
      ]
    },



    { title: "Legendary Tier", imageSrc: "/img/legendary.png", supply: "500 Medals", price: 2.5 },
    {
      title: "Legendary Tier Benefits", benefits: [
        { title: "Revenue Pool Access", description: "100% cumulative rev share, with a 10% multiplier on annual revenue." },
        { title: "Tokenization Access", description: "20% discount on purchase fees for high-demand tokenized projects." },
        {
          title: "Event Access",
          description: [
            "Exclusive offers on XdRiP Fly Block and Hotel Reservations.",
            "Livestream access to main events hosted by the company, including keynotes and announcements.",
            "Priority tickets for events and discounts on event travel packages.",
            "One free ticket per year to any company-hosted event, with VIP seating and lounge access."
          ]
        },
        { title: "Revenue Statement", description: "Personalized quarterly reports on platform performance and growth." },
        { title: "Community Voting", description: "Voting rights on companyinitiatives and new tokenization projects" },
        {
          title: "Unlocks XDRIP Holder Bonus", description: [
            "Must hold atleast (2.5%) XDRIP token supply.",
            "15% revenue share bonus."
          ]
        },]
    },



    { title: "Eternal Tier", imageSrc: "/img/eternal.png", supply: "20 Medals", price: 200 },
    {
      title: "Eternal Tier Benefits", benefits: [
        { title: "Tokenization Access", description: "The highest VIP access to the most in-demand tokenized investments." },
        { title: "Event Access", description: "Lifetime highest VIP access to all company-hosted events." },
        { title: "Private Events", description: "Invitations to exclusive, events with industry leaders and creators among the Executive Board of XdRiP Digital Management LLC." },
        { title: "Revenue Statement", description: "Detailed and personalized quarterly reports with 1:1 interaction with the Executive board." },
        { title: "Community Voting", description: "Voting rights on company initiatives and tokenization projects." },
        { title: "Executive Board Access", description: "Executive Board access, with a direct influence on future projects." },
        { title: "Global Revenue Share", description: "Highest and significative ROI Benefit translating into 0.5% share of total platform revenue." },
        { title: "Legacy Recognition", description: "Eternal holders are immortalized in a special section of the platform." },
      ]
    }
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className={Style.theForge}
      style={{
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <div className={Style.theForge_content}>
        <div className={Style.first_component}>
          <h1>THE FORGE OF DESTINY</h1>
        </div>
        <div className={Style.theLoreContent}>
          <h1 className={Style.component_title_text}>A LEGENDS LORE</h1>
          <p className={Style.loreText}>
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
        <MyDotData>
          <div className={Style.second_component}>
            <TheForge setIsModalOpen={setIsModalOpen} />
          </div>
          <div className={Style.glowingDivider}></div>
          <div className={Style.third_component}>
            <h1 className={Style.component_title_text}>MEDALS OF HONOR WALLET</h1>
            <DotWallet address={address} />
          </div>
          <div className={Style.glowingDivider}></div>
          <div className={Style.fourth_component}>
            <h1 className={Style.component_title_text}>MEDALS OF HONOR BENEFITS</h1>
            <div className={Style.flipbookwrapper}>
              <div className={isMobile ? Style.flipBookMobile : isBookOpen ? Style.flipBookOpen : Style.flipBookClosed}>
                <HTMLFlipBook
                  width={isMobile ? window.innerWidth * 0.8 : 550}
                  height={isMobile ? window.innerHeight * 0.6 : 733}
                  size="fixed"
                  maxShadowOpacity={0.5}
                  showCover={true}
                  drawShadow={true}
                  flippingTime={1000}
                  usePortrait={isMobile}
                  startZIndex={0}
                  showSwipeHint={true}
                  autoCenter={true}
                  autoSize={true}
                  mobileScrollSupport={true}
                  onFlip={handleFlip}
                >
                  {pages.map((pageContent, index) => (
                    <PageComponent
                      key={index}
                      ref={(el) => (pageRefs.current[index] = el)}
                      pageContent={pageContent}
                      pageIndex={index}
                      bnbPrice={bnbPrice}
                    />
                  ))}
                </HTMLFlipBook>
              </div>
            </div>
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
                  paddingLeft=".5rem"
                  paddingRight=".5rem"
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
          </div>
        </MyDotData>
      </div >
    </motion.div>
  );
};
export default TheForgePage;
