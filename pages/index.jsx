import React from "react";
import Head from "next/head";
import HeroSection from "../components/Landing/HeroSection";
import InvestmentProposition from "../components/Landing/InvestmentProposition";
import ShowcaseCarousel from "../components/Landing/ShowcaseCarousel";
import MedalTierSection from "../components/Landing/MedalTierSection";
import PlatformCredentials from "../components/Landing/PlatformCredentials";
import Footer from "../components/Footer/Footer";
import { useBnbPrice } from "../hooks/useBnbPrice";
import { useMedalData } from "../hooks/useMedalData";

const HomePage = ({ openModal }) => {
  const { bnbPrice } = useBnbPrice();
  const { medals, totalForged, totalSupply } = useMedalData();

  return (
    <>
      <Head>
        <title>Medals of Honor | Investment Platform by XdRiP Digital Management</title>
        <meta
          name="description"
          content="Invest in the Medals of Honor collection — tiered digital ownership tokens offering revenue sharing, XdRiP token bonuses, and exclusive access. Built on Binance Smart Chain by XdRiP Digital Management LLC."
        />
        <meta name="keywords" content="Medals of Honor, XdRiP, digital investment, blockchain, BSC, revenue sharing, NFT, DeFi" />

        <meta property="og:title" content="Medals of Honor | Forge Your Investment Legacy" />
        <meta property="og:description" content="Tiered investment medals with revenue sharing and XdRiP bonuses. 6 tiers from Common to Eternal." />
        <meta property="og:image" content="/img/legendary.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medalsofhonor.io" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Medals of Honor | XdRiP Digital Management" />
        <meta name="twitter:description" content="Tiered digital ownership — revenue sharing, token bonuses, and exclusive access." />
        <meta name="twitter:image" content="/img/legendary.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "XdRiP Digital Management LLC",
              url: "https://medalsofhonor.io",
              logo: "https://medalsofhonor.io/img/mohwallet-logo.png",
              description:
                "Blockchain-focused company building decentralized platforms for digital ownership and community-driven investment.",
            }),
          }}
        />
      </Head>

      <main>
        <HeroSection />

        <InvestmentProposition
          totalSupply={totalSupply}
          totalForged={totalForged}
          bnbPrice={bnbPrice}
        />

        <ShowcaseCarousel medals={medals} />

        {medals.map((medal, index) => (
          <MedalTierSection
            key={medal.title}
            medal={medal}
            index={index}
            bnbPrice={bnbPrice}
          />
        ))}

        <PlatformCredentials />

        <Footer openModal={openModal} />
      </main>
    </>
  );
};

export default HomePage;
