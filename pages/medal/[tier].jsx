import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MedalDetailHero from "../../components/MedalDetail/MedalDetailHero";
import InvestmentSnapshot from "../../components/MedalDetail/InvestmentSnapshot";
import BenefitsList from "../../components/MedalDetail/BenefitRow";
import TierComparison from "../../components/MedalDetail/TierComparison";
import CtaBand from "../../components/MedalDetail/CtaBand";
import Footer from "../../components/Footer/Footer";
import { MEDAL_TIERS } from "../../hooks/useMedalData";
import { TIER_BENEFITS, TIER_SNAPSHOTS } from "../../data/medalBenefits";
import { useBnbPrice } from "../../hooks/useBnbPrice";
import { useMedalData } from "../../hooks/useMedalData";

const VALID_TIERS = ["common", "uncommon", "rare", "epic", "legendary", "eternal"];

export async function getStaticPaths() {
  return {
    paths: VALID_TIERS.map((tier) => ({ params: { tier } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const tierKey = params.tier.toUpperCase();
  const tierData = MEDAL_TIERS.find((t) => t.title === tierKey);

  if (!tierData) {
    return { notFound: true };
  }

  return {
    props: {
      tierKey,
      tierData: {
        title: tierData.title,
        price: tierData.price,
        supply: tierData.supply,
        revenueShare: tierData.revenueShare,
        xdripBonus: tierData.xdripBonus,
        description: tierData.description,
        image: tierData.image,
        video: tierData.video,
      },
    },
  };
}

const MedalDetailPage = ({ tierKey, tierData, openModal }) => {
  const router = useRouter();
  const { bnbPrice } = useBnbPrice();
  const { forgedCounts } = useMedalData();

  // Scroll to top on page load and route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.asPath]);

  const medal = {
    ...tierData,
    forged: forgedCounts[tierKey]?.forged || 0,
    available: forgedCounts[tierKey]?.available || tierData.supply,
  };

  const benefits = TIER_BENEFITS[tierKey] || [];
  const snapshot = TIER_SNAPSHOTS[tierKey] || {};

  return (
    <>
      <Head>
        <title>{medal.title} Medal of Honor | Medals of Honor by XdRiP</title>
        <meta
          name="description"
          content={`${medal.title} Medal of Honor — ${medal.revenueShare} revenue weight, ${medal.price} BNB. ${medal.description.slice(0, 150)}...`}
        />
        <meta property="og:title" content={`${medal.title} Medal of Honor`} />
        <meta property="og:description" content={medal.description.slice(0, 200)} />
        <meta property="og:image" content={`https://medalsofhonor.io${medal.image}`} />
        <meta property="og:type" content="product" />
      </Head>

      {/* Fixed medal image as page background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${medal.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      <main style={{ position: "relative", zIndex: 1 }}>
        <MedalDetailHero medal={medal} bnbPrice={bnbPrice} />
        <InvestmentSnapshot snapshot={snapshot} medal={medal} />
        <BenefitsList benefits={benefits} />
        <TierComparison currentTier={tierKey} />
        <CtaBand medal={medal} bnbPrice={bnbPrice} />
        <Footer openModal={openModal} />
      </main>
    </>
  );
};

export default MedalDetailPage;
