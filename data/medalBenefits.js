export const TIER_BENEFITS = {
  COMMON: [
    { icon: "chart-pie", title: "Revenue Pool Access", text: "Gain a 10% share of the revenue pool, providing a solid foundation for financial returns at the entry level.", fillPct: 10 },
    { icon: "ticket", title: "Event Access", text: "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements. Livestream access to main company-hosted events, including keynote presentations and announcements.", fillPct: 20 },
    { icon: "link", title: "Tokenization Access", text: "Receive early insights on upcoming tokenized projects, offering a strategic advantage in new opportunities.", fillPct: 15 },
    { icon: "coins", title: "XdRiP Holder Bonus", text: "Hold at least 0.5% of the XdRiP token supply (5,000,000 XdRiP) to unlock a 2% revenue share bonus, enhancing your entry-level benefits.", fillPct: 13 },
  ],
  UNCOMMON: [
    { icon: "chart-pie", title: "Revenue Pool Access", text: "Enjoy a 25% cumulative revenue share, offering consistent financial returns and growth potential for investors.", fillPct: 25 },
    { icon: "ticket", title: "Event Access", text: "Priority tickets for events and discounts on travel packages. Livestream access to company events, including keynotes and announcements, as well as priority seating at company-hosted events.", fillPct: 40 },
    { icon: "link", title: "Tokenization Access", text: "Gain early insights into upcoming tokenized projects, keeping you ahead in the market.", fillPct: 25 },
    { icon: "coins", title: "XdRiP Holder Bonus", text: "Hold at least 0.75% of the XdRiP token supply (7,500,000 XdRiP) to unlock a 5% revenue share bonus and enjoy priority seating at company-hosted events.", fillPct: 33 },
  ],
  RARE: [
    { icon: "chart-pie", title: "Revenue Pool Access", text: "Access 45% of the revenue pool, offering significant financial rewards for investors at this tier.", fillPct: 45 },
    { icon: "ticket", title: "Event Access", text: "Priority event tickets, discounts on travel packages, and livestream access. One free VIP ticket annually with premium seating and lounge access.", fillPct: 60 },
    { icon: "link", title: "Tokenization Access", text: "10% discount on purchase fees for high-demand tokenized projects, increasing your return on investment.", fillPct: 40 },
    { icon: "coins", title: "XdRiP Holder Bonus", text: "Hold at least 1% of the XdRiP token supply (10,000,000 XdRiP) to unlock a 7% revenue share bonus and enjoy priority seating at all company-hosted events.", fillPct: 47 },
    { icon: "check-to-slot", title: "Community Voting", text: "Participate in company decision-making with voting rights on strategic initiatives and new tokenization projects.", fillPct: 50 },
    { icon: "file-invoice", title: "Revenue Reports", text: "Personalized quarterly reports detailing platform performance and growth metrics.", fillPct: 50 },
  ],
  EPIC: [
    { icon: "chart-pie", title: "Revenue Pool Access", text: "Secure 70% of the revenue pool — a high-value investment opportunity with substantial financial rewards.", fillPct: 70 },
    { icon: "ticket", title: "Event Access", text: "All priority access plus one complimentary VIP ticket per year, complete with premium seating and lounge access.", fillPct: 80 },
    { icon: "link", title: "Tokenization Access", text: "15% discount on purchase fees for high-demand tokenized projects, enhancing your investment potential.", fillPct: 60 },
    { icon: "coins", title: "XdRiP Holder Bonus", text: "Hold at least 1.25% of the XdRiP token supply (12,500,000 XdRiP) to unlock a 10% revenue share bonus.", fillPct: 67 },
    { icon: "check-to-slot", title: "Community Voting", text: "Exercise voting rights on critical company initiatives and new tokenization projects, allowing you to influence strategic decisions.", fillPct: 75 },
    { icon: "file-invoice", title: "Revenue Reports", text: "Personalized quarterly reports on platform performance and growth, giving you a clear view of your returns.", fillPct: 75 },
  ],
  LEGENDARY: [
    { icon: "chart-pie", title: "Revenue Pool Access", text: "100% revenue pool share with a 10% multiplier on annual revenue. Maximum financial rewards for top-tier investors.", fillPct: 100 },
    { icon: "ticket", title: "Event Access", text: "Full VIP access, complimentary tickets, premium seating, and lounge access at all company-hosted events.", fillPct: 100 },
    { icon: "link", title: "Tokenization Access", text: "20% discount on purchase fees for high-demand tokenized projects — premium gateway to lucrative opportunities.", fillPct: 80 },
    { icon: "coins", title: "XdRiP Holder Bonus", text: "Hold at least 1.5% of the XdRiP token supply (15,000,000 XdRiP) to unlock an additional 15% revenue share bonus.", fillPct: 100 },
    { icon: "check-to-slot", title: "Community Voting", text: "Participate in key company decisions with voting rights on strategic initiatives.", fillPct: 100 },
    { icon: "file-invoice", title: "Revenue Reports", text: "Detailed quarterly reports with insights into your investment returns.", fillPct: 100 },
  ],
  ETERNAL: [
    { icon: "chart-pie", title: "Global Revenue Share", text: "Secure a 0.5% share of total platform revenue, reflecting the growing success and scalability of the company.", fillPct: 100 },
    { icon: "globe", title: "Global Influence & Networking", text: "Collaborate with industry leaders, innovators, and other Eternal members to build a network with global impact.", fillPct: 100 },
    { icon: "bolt", title: "Premium Early Access", text: "First priority access to tokenized investments in real-world assets, gaming, financial services, and more.", fillPct: 100 },
    { icon: "star", title: "Lifetime VIP Access", text: "VIP access to all company-hosted events, industry conferences, and private gatherings — for life.", fillPct: 100 },
    { icon: "crown", title: "Executive Board Access", text: "Join the Executive Board, shaping the vision, strategy, and partnerships of XdRiP Digital Management LLC.", fillPct: 100 },
    { icon: "trophy", title: "Legacy Recognition", text: "Immortalized as a founding visionary in a dedicated section of the platform, celebrated for generations.", fillPct: 100 },
  ],
};

export const TIER_SNAPSHOTS = {
  COMMON:    { revenueWeight: 10,  bonusThreshold: "5,000,000 XdRiP (0.5%)", bonusPct: 2,  position: "Entry Tier", monthlyEst: "0.008" },
  UNCOMMON:  { revenueWeight: 25,  bonusThreshold: "7,500,000 XdRiP (0.75%)", bonusPct: 5,  position: "Growth Tier", monthlyEst: "0.02" },
  RARE:      { revenueWeight: 45,  bonusThreshold: "10,000,000 XdRiP (1%)", bonusPct: 7,  position: "Elite Tier", monthlyEst: "0.04" },
  EPIC:      { revenueWeight: 70,  bonusThreshold: "12,500,000 XdRiP (1.25%)", bonusPct: 10, position: "Premium Tier", monthlyEst: "0.06" },
  LEGENDARY: { revenueWeight: 100, bonusThreshold: "15,000,000 XdRiP (1.5%)", bonusPct: 15, position: "Apex Tier", monthlyEst: "0.1" },
  ETERNAL:   { revenueWeight: 100, bonusThreshold: "N/A", bonusPct: 0,  position: "Executive Circle", monthlyEst: "0.5% of total" },
};
