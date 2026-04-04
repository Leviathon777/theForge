import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import HeroSection from "../components/Landing/HeroSection";
import LoreSection from "../components/Landing/LoreSection";
import InvestmentProposition from "../components/Landing/InvestmentProposition";
import ShowcaseCarousel from "../components/Landing/ShowcaseCarousel";
import MedalTierSection from "../components/Landing/MedalTierSection";
import PlatformCredentials from "../components/Landing/PlatformCredentials";
import Footer from "../components/Footer/Footer";
import { useBnbPrice } from "../hooks/useBnbPrice";
import { useMedalData } from "../hooks/useMedalData";

const DedicationCard = () => (
  <section style={{ padding: "4rem 2rem" }}>
    <motion.div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        background: "var(--glass-bg-strong)",
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
        border: "1px solid var(--glass-border-medium)",
        borderRadius: "var(--radius-xl)",
        padding: "3rem",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(37,95,244,0.06)",
        position: "relative",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(37,95,244,0.3), transparent)",
          borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
        }}
      />
      <h2
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1.2rem, 2vw, 1.4rem)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "1.5rem",
          background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-text-primary) 50%, var(--color-accent) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        To Our Unbreakable Community
      </h2>
      <div
        style={{
          fontFamily: "'Lora', serif",
          fontStyle: "italic",
          fontSize: "0.95rem",
          color: "var(--color-text-secondary)",
          lineHeight: 1.8,
        }}
      >
        <p style={{ marginBottom: "1rem" }}>
          This is for you — the loyal, rock-solid holders who have stood by us through
          every high and low. The Medals of Honor are our tribute to you, to your belief
          in us when we were tested, to the strength of your support that lifted us up
          and carried us forward.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          We remember the times when the path grew dark. But through it all, you stayed.
          You believed. Your unwavering dedication gave us the courage to rise above
          every challenge. Because of you, we didn&apos;t just survive — we thrived.
        </p>
        <p style={{ marginBottom: "1.5rem" }}>
          These Medals are more than symbols; they carry the story of resilience, unity,
          and the powerful loyalty that you showed us. They are a promise that we will
          continue to grow, to innovate, and to honor the incredible support you have
          given us.
        </p>
        <p
          style={{
            fontStyle: "normal",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
          }}
        >
          With all our love, gratitude, and admiration —
          <br />
          <strong style={{ color: "var(--color-text-secondary)" }}>
            Brad, Jim, Flo, Jordi, &amp; Amos
          </strong>
        </p>
      </div>
    </motion.div>
  </section>
);

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
        <meta property="og:title" content="Medals of Honor | Forge Your Investment Legacy" />
        <meta property="og:description" content="Tiered investment medals with revenue sharing and XdRiP bonuses. 6 tiers from Common to Eternal." />
        <meta property="og:image" content="/img/legendary.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medalsofhonor.io" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Medals of Honor | XdRiP Digital Management" />
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
            }),
          }}
        />
      </Head>

      <main>
        <HeroSection />
        <LoreSection />

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

        <DedicationCard />
        <PlatformCredentials />
        <Footer openModal={openModal} />
      </main>
    </>
  );
};

export default HomePage;
