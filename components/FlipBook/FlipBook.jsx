import React, { useState, useEffect, useRef, memo, forwardRef } from "react";
import { motion } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import Style from "./FlipBook.module.css";
import { useRouter } from 'next/router';


const MedalTierPage = ({ title, imageSrc, supply, price, pageNumber }) => {
    return (
        <div className={Style.tierPage}>
            <div className={Style.tierContent}>
                <div className={Style.pageUpper}>
                    <div className={Style.tierInnerImage}>
                        <img
                            src={imageSrc}
                            alt={title}
                            className={Style.tierImage}
                        />
                    </div>
                </div>
                <div className={Style.tierLower}>
                    <h1 className={Style.tierContentTitle}>{title}</h1>
                    <div className={Style.tierPricing}>
                        {supply && (
                            <div className={Style.pricingItem}>
                                <p className={Style.label}>Maximum Supply:</p>
                                <p className={Style.value}>{supply}</p>
                            </div>
                        )}
                        {price && (
                            <div className={Style.pricingItem}>
                                <p className={Style.label}>Investment Price:</p>
                                <p className={Style.value}>{price} BNB</p>
                            </div>
                        )}
                    </div>

                </div>
                <div className={Style.bottomNumber}>{pageNumber}</div>
            </div>
        </div>
    );
};


const FlipBook = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const router = useRouter();
    const pageRefs = useRef([]);
    const bookRef = useRef();

    const handleResize = () => setIsMobile(window.innerWidth < 768);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const mapPhysicalToLogical = (physicalPage, isMobile) => {
        if (isMobile) {
            return physicalPage;
        } else {
            if (physicalPage === 0) return 0;
            return Math.floor((physicalPage - 1) / 2) + 1;
        }
    };

    const mapLogicalToPhysical = (logicalPage, isMobile) => {
        if (isMobile) {
            return logicalPage;
        } else {
            if (logicalPage === 0) return 0;
            return (logicalPage - 1) * 2 + 1;
        }
    };

    const goToPage = (logicalPage) => {
        const totalLogicalPages = isMobile
            ? pages.length
            : Math.ceil((pages.length - 1) / 2) + 1;

        if (logicalPage < 0 || logicalPage >= totalLogicalPages) return;

        const targetPage = mapLogicalToPhysical(logicalPage, isMobile);

        if (bookRef.current) {
            bookRef.current.pageFlip().flip(targetPage);
            setCurrentPage(logicalPage);
        }
    };

    const handleFlip = (e) => {
        const flippedPage = e.data;
        const logicalPage = mapPhysicalToLogical(flippedPage, isMobile);
        setCurrentPage(logicalPage);
        if (flippedPage === 0) {
            setIsBookOpen(false);
        } else {
            setIsBookOpen(true);
        }
    };


    const pages = [

        // COVER PAGE
        {
            title: <div className={Style.coverPage}>
                <img src="/img/book_background.png"
                    alt="Cover Page"
                    className={`${Style.imagePage}`} />
            </div>,
        },


        // DEDICATION PAGE
        {
            title: (
     
                    <div className={Style.dedicationContainer}>
                        <div className={Style.dedicationContent}>
                            <p className={Style.dedicationTitle}>To Our Unbreakable Community,</p>
                            <div className={Style.dedicationPages}>
                                <p className={Style.dedicationParagraph}>
                                    This is for you—the loyal, rock-solid holders who have stood by us through every high and low. The Medals of Honor are our tribute to you, to your belief in us when we were tested, to the strength of your support that lifted us up and carried us forward. You’ve been more than a community; you are our family, the very heartbeat of everything we’ve built, and you deserve all the gratitude and honor we can give.
                                </p>
                                <p className={Style.dedicationParagraph}>
                                    We remember the times when the path grew dark. Not only did the Caller Syndicate try to tear us down, but two of our own team members betrayed us, challenging everything we had worked for. But through it all, you stayed. You believed. Your unwavering dedication gave us the courage to rise above every challenge. Because of you, we didn’t just survive—we thrived. Today, our businesses are reaching new heights, our vision is expanding, and our future looks brighter than ever, all thanks to your steadfast loyalty and unbreakable faith.
                                </p>
                                <p className={Style.dedicationParagraph}>
                                    These Medals are more than symbols; they carry the story of resilience, unity, and the powerful loyalty that you showed us. They honor those who stayed true, who believed in a vision bigger than any setback, and who have been with us through every step of this journey. They are for you, and for those who will join us, inspired by your example to become part of something extraordinary.
                                </p>
                                <p className={Style.dedicationParagraph}>
                                    As we look to the future, these Medals represent the legacy we are building together. They are a promise to each of you—a promise that we will continue to grow, to innovate, and to honor the incredible support you have given us. For those who join us next, may they learn from the strength of this community and feel the depth of commitment that each Medal represents.
                                </p>
                                <p className={Style.dedicationParagraph}>
                                    From the depths of our hearts, thank you. Thank you for standing by us, for fighting with us, and for believing in a vision that grows brighter every day because of you. We are endlessly grateful to have each of you with us, not just as holders, but as true partners in this dream.
                                </p>
                                <p className={Style.dedicationParagraph}>
                                    To all of you, with all that we have: here’s to the future, to your future, and to the legacy we are building together. You are the soul of this project, the reason we strive, and the family we are so proud to have by our side.
                                </p>
                            </div>
                            <p className={Style.dedicationSignature}>
                                With all our love, gratitude, and admiration,<br />
                                Brad, Jim, Flo, & Jordi
                            </p>
                        </div>
                    </div>      
            )
        },

        // TABLE OF CONTENTS
        {
            title: (
                <div className={Style.contentsContainer}>
                    <div className={Style.contentsContent}>
                        <h2 className={Style.contentsTitle}>Table of Contents</h2>
                        <div className={Style.contentsList}>
                            {[
                                { title: "Common Medal", page: "Page 1" },
                                { title: "Common Medal Benefits", page: "Page 2" },
                                { title: "Uncommon Medal", page: "Page 3" },
                                { title: "Uncommon Medal Benefits", page: "Page 4" },
                                { title: "Rare Medal", page: "Page 5" },
                                { title: "Rare Medal Benefits", page: "Page 6" },
                                { title: "Epic Medal", page: "Page 7" },
                                { title: "Epic Medal Benefits", page: "Page 8" },
                                { title: "Legendary Medal", page: "Page 9" },
                                { title: "Legendary Medal Benefits", page: "Page 10" },
                                { title: "Executive Investment", page: "Page 11" },
                                { title: "The ETERNAL Opportunity", page: "Page 12" },
                                { title: "The ETERNALS Medal", page: "Page 13" },
                                { title: "The ETERNALS Benefits", page: "Page 14" },
                                { title: "Investment Disclaimer A", page: "Page 15" },
                                { title: "Investment Disclaimer B", page: "Page 16" },
                                { title: "Investment Disclaimer C", page: "Page 17" },
                                { title: "More D.O.T. Links", page: "Back Page" },
                            ].map((content, index) => (
                                <div className={Style.contentsItem} key={index}>
                                    <div className={Style.contentTitle}>{content.title}</div>
                                    <div className={Style.pageNumber}>{content.page}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },


        // COMMON TIER IMAGE PAGE
        {
            title: (
                <MedalTierPage
                    title="COMMON"
                    imageSrc="/img/common.png"
                    supply="10,000 Medals"
                    price={0.5}
                    pageNumber="Page 1"
                />
            ),
        },

        // COMMON TIER BENEFITS PAGE
        {
            title: (
                <>
                    <div className={Style.proposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.proposalTop}>
                                <h2 className={Style.proposalTitle}>Common Tier Benefits:</h2>
                                <h3 className={Style.proposalSubTitle}>Foundation-Level Rewards</h3>
                            </div>
                            <div className={Style.proposalPages}>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Pool Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Gain a 10% share of the revenue pool, providing a solid foundation for financial returns at the entry level.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Tokenization Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Receive early insights on upcoming tokenized projects, offering a strategic advantage in new opportunities.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Event Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Enjoy exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements. Gain livestream access to main company-hosted events, including keynote presentations and announcements.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Unlocks XDRIP Holder Bonus:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Hold at least 0.5% of the XDRIP token supply to unlock a 2% revenue share bonus, enhancing your entry-level benefits.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 2</div>
                    </div>
                </>
            ),
        },


        // UNCOMMON TIER IMAGE PAGE
        {
            title: (
                <MedalTierPage
                    title="UNCOMMON"
                    imageSrc="/img/uncommon.png"
                    supply="5,000 Medals"
                    price={1.0}
                    pageNumber="Page 3"
                />
            ),
        },

        // UNCOMMON TIER BENEFITS PAGE
        {
            title: (
                <>
                    <div className={Style.proposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.proposalTop}>
                                <h2 className={Style.proposalTitle}>Uncommon Tier Benefits:</h2>
                                <h3 className={Style.proposalSubTitle}>Valuable Opportunities for Growth</h3>
                            </div>
                            <div className={Style.proposalPages}>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Pool Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Enjoy a 25% cumulative revenue share, offering consistent financial returns and growth potential for investors.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Tokenization Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Gain early insights into upcoming tokenized projects, keeping you ahead in the market.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Event Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Take advantage of exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements. Receive livestream access to company events, including keynotes and announcements, as well as priority tickets for events and discounts on travel packages.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Unlocks XDRIP Holder Bonus:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Hold at least .75% of the XDRIP token supply to unlock a 5% revenue share bonus and enjoy priority seating at company-hosted events.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 4</div>
                    </div>
                </>
            ),
        },


        // RARE TIER IMAGE PAGE
        {
            title: (
                <MedalTierPage
                    title="RARE"
                    imageSrc="/img/rare.png"
                    supply="2,500 Medals"
                    price={1.5}
                    pageNumber="Page 5"
                />
            ),
        },

        // RARE TIER BENEFITS PAGE
        {
            title: (
                <>
                    <div className={Style.proposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.proposalTop}>
                                <h2 className={Style.proposalTitle}>Rare Tier Benefits:</h2>
                                <h3 className={Style.proposalSubTitle}>Exclusive Opportunities and Rewards</h3>
                            </div>
                            <div className={Style.proposalPages}>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Pool Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Access 45% of the revenue pool, offering significant financial rewards for investors at this tier.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Tokenization Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Enjoy a 10% discount on purchase fees for high-demand tokenized projects, increasing your return on investment.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Event Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Take advantage of exclusive offers on XdRiP Fly Block and Hotel Reservations. Receive priority event tickets, discounts on travel packages, and livestream access to company-hosted events. Additionally, benefit from one free VIP ticket annually with premium seating and lounge access.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Statement:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Stay informed with personalized quarterly reports detailing platform performance and growth metrics.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Community Voting:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Participate in company decision-making with voting rights on strategic initiatives and new tokenization projects.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Unlocks XDRIP Holder Bonus:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Hold at least 1% of the XDRIP token supply to unlock a 7% revenue share bonus and enjoy priority seating at all company-hosted events.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 6</div>
                    </div>
                </>
            ),
        },

        // EPIC TIER IMAGE PAGE
        {
            title: (
                <MedalTierPage
                    title="EPIC"
                    imageSrc="/img/epic.png"
                    supply="1,000 Medals"
                    price={2.0}
                    pageNumber="Page 7"
                />

            ),
        },

        // EPIC TIER BENEFITS PAGE
        {
            title: (
                <>
                    <div className={Style.proposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.proposalTop}>
                                <h2 className={Style.proposalTitle}>Epic Tier Benefits:</h2>
                                <h3 className={Style.proposalSubTitle}>High-Value Returns and Exclusive Privileges</h3>
                            </div>
                            <div className={Style.proposalPages}>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Pool Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Secure 70% of the revenue pool, marking this tier as a high-value investment opportunity with substantial financial rewards.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Tokenization Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Benefit from a 15% discount on purchase fees for high-demand tokenized projects, enhancing your investment potential.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Event Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Enjoy exclusive offers on XdRiP Fly Block and Hotel Reservations. Receive priority tickets, discounts on event travel packages, and livestream access to all major events. Additionally, claim one complimentary VIP ticket per year, complete with premium seating and lounge access.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Statement:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Stay informed with personalized quarterly reports on platform performance and growth, giving you a clear view of your returns.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Community Voting:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Exercise voting rights on critical company initiatives and new tokenization projects, allowing you to influence strategic decisions.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Unlocks XDRIP Holder Bonus:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Investors holding at least 1.25% of the XDRIP token supply unlock a 10% revenue share bonus and enjoy priority seating at all company-hosted events.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 8</div>
                    </div>
                </>
            ),
        },


        // LEGENDARY TIER IMAGE PAGE
        {
            title: (
                <MedalTierPage
                    title="LEGENDARY"
                    imageSrc="/img/legendary.png"
                    supply="500 Medals"
                    price={2.5}
                    pageNumber="Page 9"
                />
            ),
        },

        // LEGENDARY TIER BENEFITS PAGE
        {
            title: (
                <>
                    <div className={Style.proposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.proposalTop}>
                                <h2 className={Style.proposalTitle}>Legendary Investment Benefits:</h2>
                                <h3 className={Style.proposalSubTitle}>Unparalleled Rewards and Opportunities</h3>
                            </div>
                            <div className={Style.proposalPages}>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Pool Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Enjoy 100% revenue pool share with a 10% multiplier on annual revenue. Ensuring substantial financial rewards for our top-tier investors.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Tokenization Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Gain a 20% discount on purchase fees for high-demand tokenized projects, making this tier a premium gateway to lucrative opportunities.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Event Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Enjoy exclusive offers on XdRiP Fly Block and Hotel Reservations. Receive priority tickets, discounts on event travel packages, and livestream access to all major events. Additionally, claim one complimentary VIP ticket per year, complete with premium seating and lounge access.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Statement:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Receive personalized quarterly reports on platform performance and growth, offering detailed insights into your investment returns.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Community Voting:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Participate in key company decisions with voting rights on strategic initiatives and new tokenization projects.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Unlocks XDRIP Holder Bonus:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Investors holding at least 1.5% of the XDRIP token supply unlock an additional 15% revenue share bonus.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 10</div>
                    </div>
                </>
            ),
        },

        // EXECUTIVE INVESTMENT IMAGE PAGE
        {
            title: (
                <div className={Style.tierPage}>
                    <div className={Style.tierContent}>
                        <div className={Style.pageUpper}>
                            <div className={Style.tierInnerImage}>
                                <img
                                    src="/img/executives.jpg"
                                    alt={"XDRIP Executive Investment"}
                                    className={Style.tierImage}
                                />
                            </div>
                        </div>
                        <div className={Style.tierLower}>
                            <h1 className={Style.execContentTitle}>XDRIP Executive Investment</h1>
                        </div>
                        <div className={Style.bottomNumber}>Page 11</div>
                    </div>
                </div>
            ),
        },

        // ETERNAL OPPORTUNITY PAGE
        {
            title: "",
            title: (
                <>
                    <div className={Style.proposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.proposalTop}>
                                <h2 className={Style.proposalTitle}>The ETERNAL Opportunity:</h2>
                            </div>
                            <div className={Style.proposalPages}>
                                <div className={Style.proposalPage}>
                                    <h3 className={Style.proposalLabel}>The ETERNAL Is Not A Tier</h3>
                                    <p className={Style.proposalParagraph}>
                                        It is, as the name implies, an elite investment opportunity for only 20
                                        visionaries to join the Executive Leadership Circle of XdRiP Digital Management LLC.

                                        This is your chance to become a founding architect of a platform poised for global
                                        disruption, offering substantial financial returns, strategic influence, and an enduring legacy.
                                    </p>
                                </div>
                                <div className={Style.proposalPage}>
                                    <h3 className={Style.proposalLabel}>Why Invest in the ETERNAL Membership?</h3>
                                    <p className={Style.proposalParagraph}>
                                        The ETERNAL Membership provides you with executive-level access, a
                                        direct influence on the company’s growth, and a unique stake in
                                        one of the most ambitious tokenization platforms in the world.
                                        This investment positions you at the pinnacle of decision-making,
                                        with unparalleled benefits that reflect your pivotal role.
                                    </p>
                                </div>
                                <div className={Style.proposalPage}>
                                    <h3 className={Style.proposalLabel}>Executive Leadership Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Join the Executive Board, shaping the vision, strategy, and partnerships of XdRiP Digital Management LLC.
                                        Participate in board-level meetings, where you’ll influence high-stakes decisions and innovative projects.
                                        Gain voting power on key company initiatives, platform developments, and tokenization strategies, ensuring your voice defines the future.
                                    </p>
                                </div>
                                <div className={Style.proposalPage}>
                                    <h3 className={Style.proposalLabel}>Positioned for Unparalleled Growth</h3>
                                    <p className={Style.proposalParagraph}>
                                        By joining the ETERNAL Membership, you secure your seat at the decision-making table and position yourself for exponential
                                        returns as XdRiP scales across industries and platforms.
                                        This is your opportunity to shape the future of tokenized investments
                                        and leave an indelible mark on an industry poised for global transformation.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 12</div>
                    </div>
                </>
            ),
        },

        // ETERNALS IMAGE PAGE
        {
            title: (
                <MedalTierPage
                    title="The ETERNALS"
                    imageSrc="/img/eternal.png"
                    supply="20 Medals"
                    price={200}
                    pageNumber="Page 13"
                />
            ),
        },

        // ETERNAL BENEFITS PAGE
        {
            title: (
                <>
                    <div className={Style.proposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.proposalTop}>
                                <h2 className={Style.proposalTitle}>Exclusive ETERNAL Investors:</h2>
                                <h3 className={Style.proposalSubTitle}> Unmatched Executive Benefits and Returns</h3>
                            </div>
                            <div className={Style.proposalPages}>

                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Revenue Share & Earnings Potential:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Secure a 0.5% share of total platform revenue, reflecting the growing success and scalability of the company.
                                        Your revenue share increases as the platform expands across industries, creating massive future earning potential.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Early Access to Premium Opportunities:</h3>
                                    <p className={Style.proposalParagraph}>
                                        First priority access to tokenized investments in real-world assets, gaming, financial services, and more.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Global Influence & Networking:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Collaborate with industry leaders, innovators, and other Eternal members to build a network with global impact.
                                    </p>
                                </div>

                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Lifetime (Eternal) VIP Event Access:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Enjoy VIP access to all company-hosted events, industry conferences, and private gatherings.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Personalized Revenue Reports:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Receive detailed quarterly earnings reports, along with direct access to insights from the Executive Board.
                                    </p>
                                </div>
                                <div className={Style.rightProposalPage}>
                                    <h3 className={Style.proposalLabel}>Legacy Recognition:</h3>
                                    <p className={Style.proposalParagraph}>
                                        Be immortalized as a founding visionary in a dedicated section of the platform, ensuring your contributions are celebrated for generations.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 14</div>
                    </div>
                </>
            ),
        },

        // MOH DISCLAIMER PAGE 1
        {
            title: (
                <>
                    <div className={Style.leftProposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.disclaimerTop}>
                                <h2 className={Style.disclaimerTitle}>Medals Of Honor DOTs </h2>
                                <h2 className={Style.disclaimerTitle}> (Digital Ownership Tokens)</h2>
                                <h2 className={Style.disclaimerTitle}>Investment Disclaimer</h2>
                            </div>
                            <div className={Style.disclaimerPages}>

                                <div className={Style.disclaimerPage}>
                                    <p className={Style.disclaimerLeader}>
                                        Investment in Medals Of Honor DOTs, including The Eternals, involves risk and is suitable only for sophisticated
                                        investors who fully understand and accept these risks. Please read this disclaimer carefully.
                                    </p>
                                </div>
                                <div className={Style.disclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Nature of Investment:</h3>
                                    <p className={Style.disclaimerParagraph}>
                                        Medals Of Honor DOTs are non-tradable Digital Ownership Tokens that symbolize your investment and stake in our company.
                                        They are not listed or available on any public market and are intended solely as a representation of your investment.
                                    </p>
                                </div>
                                <div className={Style.disclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Risks Associated with Investment:</h3>
                                    <p className={Style.disclaimerParagraph}>
                                        There is no guarantee of success or profitability, and past performance does not guarantee future results.
                                    </p>
                                </div>

                                <div className={Style.disclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>No Market Liquidity: </h3>
                                    <p className={Style.disclaimerParagraph}>
                                        These are not tradable and have no secondary market; once invested, your capital is committed until the project's completion or dissolution.
                                    </p>
                                </div>
                                <div className={Style.disclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Illiquidity and Capital Commitment: </h3>
                                    <p className={Style.disclaimerParagraph}>
                                        Your investment is locked in for the duration of the project. You should be prepared to bear the financial risk of this commitment.
                                    </p>
                                </div>
                                <div className={Style.disclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Benefits of Investment:</h3>
                                    <p className={Style.disclaimerParagraph}>
                                        Exclusive Board and Return Rights: Investors in The Eternals are granted exclusive rights to participate in strategic decisions
                                        via board representation, ensuring your voice is heard in key company decisions.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 15</div>
                    </div>
                </>
            ),
        },

        // MOH DISCLAIMER PAGE 2
        {
            title: (
                <>
                    <div className={Style.proposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.disclaimerTop}>
                                <h2 className={Style.disclaimerTitle}>Medals Of Honor DOTs </h2>
                                <h2 className={Style.disclaimerTitle}> (Digital Ownership Tokens)</h2>
                                <h2 className={Style.disclaimerTitle}>Investment Disclaimer</h2>
                            </div>
                            <div className={Style.disclaimerPages}>

                                <div className={Style.rightDisclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Revenue Share:</h3>
                                    <p className={Style.disclaimerParagraph}>
                                        As outlined in the benefits, you are entitled to a generous share of the revenue created by our successful ventures,
                                        providing a direct benefit from the company's growth and earnings.
                                    </p>
                                </div>
                                <div className={Style.rightDisclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Significant Contribution: </h3>
                                    <p className={Style.disclaimerParagraph}>
                                        Your investment not only represents a financial stake but also signifies your commitment to our vision,
                                        offering you a unique position within our businesses.
                                    </p>
                                </div>
                                <div className={Style.rightDisclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>General Provisions:</h3>
                                    <p className={Style.disclaimerParagraph}>
                                        No Financial Advice: This document does not constitute investment advice. You are encouraged to consult with your own legal,
                                        financial, and tax advisors to evaluate the suitability of this investment for your personal circumstances.
                                    </p>
                                </div>

                                <div className={Style.rightDisclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Forward-Looking Statements: </h3>
                                    <p className={Style.disclaimerParagraph}>
                                        Any projections or forward-looking statements contained herein are based on current expectations and involve risks and uncertainties.
                                        Actual results may differ.
                                    </p>
                                </div>
                                <div className={Style.rightDisclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>No Assurance of Returns: </h3>
                                    <p className={Style.disclaimerParagraph}>
                                        While we strive continuously for success, there is no assurance that you will receive returns on your investment.
                                        All investments carry inherent risks, including the possibility of loss.
                                    </p>
                                </div>
                                <div className={Style.rightDisclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Acknowledgment:</h3>
                                    <p className={Style.disclaimerParagraph}>
                                        By investing in Medals Of Honor DOTs, you acknowledge that you have read and understood this disclaimer, recognizing the risk involved.
                                        You are making an informed decision based on your personal financial situation, risk tolerance, and investment understanding.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 16</div>
                    </div>
                </>
            ),
        },

        // MOH DISCLAIMER PAGE 3
        {
            title: (
                <>
                    <div className={Style.leftProposalContainer}>
                        <div className={Style.proposalContent}>
                            <div className={Style.disclaimerTop}>
                                <h2 className={Style.disclaimerTitle}>Medals Of Honor DOTs </h2>
                                <h2 className={Style.disclaimerTitle}> (Digital Ownership Tokens)</h2>
                                <h2 className={Style.disclaimerTitle}>Investment Disclaimer</h2>
                            </div>
                            <div className={Style.disclaimerPages}>
                                <div className={Style.disclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Encouragement to Invest:</h3>
                                    <p className={Style.disclaimerParagraph}>
                                        We invite you to join us in this groundbreaking venture where your investment not only supports innovative business but also positions
                                        you at the heart of our company's future. With The Eternals, you're not just investing in a company; you're investing in a legacy.
                                    </p>
                                </div>
                                <div className={Style.disclaimerPage}>
                                    <h3 className={Style.disclaimerLabel}>Please note:</h3>
                                    <p className={Style.disclaimerParagraph}>
                                        This disclaimer is intended to inform and does not waive any rights you may have under applicable law. All investors must be prepared for
                                        the possibility of loss, understanding that high rewards come with high risks.
                                    </p>
                                </div>

                                <div className={Style.disclaimerPage}>
                                    <p className={Style.disclaimerLeader}>
                                        Your investment in Medals Of Honor DOTs is an investment in our shared vision for success and innovation in
                                        XdRiP Digital Management, LLC, and all of its subsidiaries.
                                    </p>
                                </div>
                                <div className={Style.disclaimerPage}>
                                    <p className={Style.disclaimerLeader}>
                                        This disclaimer is for informational purposes and should not be considered legal or financial advice.
                                        Please contact us or consult with your professional advisors for specific guidance related to your investment.
                                    </p>
                                </div>
                                <div className={Style.disclaimerPage}>
                                    <p className={Style.disclaimerLeader}>
                                        Please contact us with any questions and or concerns involving your investment at (contact@moh.xdrip.io).
                                        We thank you for your consideration and interest of XDRIP Digital Management LLC.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={Style.bottomNumber}>Page 17</div>
                    </div>
                </>
            ),
        },
        // BACK PAGE
        {
            title: (
                <div className={Style.proposalContainer}>
                    <div className={Style.proposalContent}>
                        <img
                            src="/img/back_page.png"
                            alt="Back Page"
                            className={Style.backPageImage}
                        />
                        {/* Overlay Content */}
                        <div className={Style.overlayContent}>
                        <h2 className={Style.disclaimerTitle}>PRODUCT LINKS</h2>
                            <p>For More Detailed Benefit Information Visit:</p>
                            <a href="https://xdrip.io/3d-flip-book/moh-medals-of-honor-booklet/" target="_blank" rel="noopener noreferrer" className={Style.linkPlaceholder}>
                                MOH DOCUMENTATION
                            </a>
                            <a href="https://xdrip.io/3d-flip-book/dots-digital-ownership-tokens-booklet/" target="_blank" rel="noopener noreferrer" className={Style.linkPlaceholder}>
                                D.O.T. DOCUMENTATION
                            </a>
                            <a href="https://xdrip.io/3d-flip-book/trace-tokenized-record-for-authentic-content-and-evidence-booklet/" target="_blank" rel="noopener noreferrer" className={Style.linkPlaceholder}>
                                TRACE DOCUMENTATION
                            </a>
                        </div>
                    </div>
                </div>
            ),
        }

    ];

    return (
        <div className={Style.flipbookwrapper}>
            <div className={isMobile ? Style.flipBookMobile : isBookOpen ? Style.flipBookOpen : Style.flipBookClosed}>
                <HTMLFlipBook
                    ref={bookRef}
                    width={isMobile ? 325 : 550}
                    height={isMobile ? 475 : 733}
                    size="stretch"
                    minWidth={isMobile ? 325 : 550}
                    maxWidth={1000}
                    minHeight={isMobile ? 475 : 733}
                    maxHeight={1533}
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
                        <div key={index} ref={(el) => (pageRefs.current[index] = el)} className={Style.page}>
                            {pageContent.title}
                        </div>
                    ))}
                </HTMLFlipBook>
            </div>

            <div className={Style.navigationControls}>
                <button
                    className={Style.navButton}
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    ←
                </button>
                <div className={Style.pageTrackerContainer}>
                    <span className={Style.pageTracker}>
                        Navigation
                    </span>
                    <span className={Style.swipeHint}>
                        ( Click Or Swipe )
                    </span>
                </div>
                <button
                    className={Style.navButton}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={
                        currentPage >=
                        (isMobile ? pages.length - 1 : Math.ceil((pages.length - 1) / 2))
                    }
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default FlipBook;
