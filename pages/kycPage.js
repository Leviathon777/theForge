import { useEffect } from 'react';
import styles from '../styles/KYCPage.module.css';
import { Button } from '../components/componentsindex';

const KYCPage = () => {
  const refId = `user-${Date.now()}`;

  const loadBlockpassWidget = () => {
    const blockpass = new window.BlockpassKYCConnect('the_forge__medals_of_honor_c231b', {
      refId: refId,
      elementId: 'blockpass-kyc-connect',
      mainColor: '000000',
    });

    blockpass.startKYCConnect();

    blockpass.on('KYCConnectSuccess', () => {
      alert('KYC process completed successfully!');
    });
  };

  useEffect(() => {
    if (window.BlockpassKYCConnect) {
      loadBlockpassWidget();
    } else {
      console.error('Blockpass script not loaded!');
    }
  }, []);

  return (
    <div className={styles.container}>
        <h1>XDRIP Digital Management KYC Verification</h1>
      <section className={styles.walkthrough}>      
        <p>
          At <strong>XDRIP Digital Management</strong>, your privacy and security are our top priorities. 
          Our **Know Your Customer (KYC)** process is designed to ensure a safe, secure, and compliant environment 
          while maintaining the decentralized ethos of blockchain technology. 
          This process allows us to offer you added trust and security without compromising your autonomy.
        </p>

        <h2>Why Complete KYC?</h2>
        <ul>
          <li>
            <strong>Enhanced Security:</strong> Verifying your identity adds an extra layer of protection 
            for your assets and transactions, helping prevent fraud or misuse of funds.
          </li>
          <li>
            <strong>Access to Special Features:</strong> While KYC is optional for tiers 
            such as <em>Common, Uncommon, Rare, Epic, and Legendary</em>, it is <strong>mandatory</strong> 
            for acquiring the **Eternal Medal**, which provides unparalleled benefits and access to exclusive opportunities.
          </li>
          <li>
            <strong>Future-Proof Compliance:</strong> As global regulations surrounding decentralized finance evolve, 
            completing KYC ensures you remain ahead of any potential legal requirements, protecting your rights and investments.
          </li>
          <li>
            <strong>Community Trust:</strong> Participating in KYC helps create a trusted and reliable community of users, 
            reinforcing our collective commitment to security and transparency.
          </li>
        </ul>

        <h2>How KYC Complements Decentralization</h2>
        <p>
          While we believe in the core principles of decentralization, the KYC process is a strategic measure to 
          navigate the changing legal landscape and ensure the longevity of our ecosystem. For most tiers, 
          completing KYC remains a personal choice, giving you the freedom to decide how you engage with The Forge.
        </p>
        <p>
          For the **Eternal Medal**, which provides a gateway to exclusive rewards and governance privileges, KYC is required 
          to meet legal obligations and offer the highest level of security and accountability.
        </p>

        <h2>What to Expect During the KYC Process</h2>
        <ol>
          <li>
            Click the <strong>"Verify with Blockpass"</strong> button below to begin the process.
          </li>
          <li>
            Provide your details, such as your name, date of birth, and valid identification documents (e.g., passport or driver’s license).
          </li>
          <li>
            Upload a clear, valid image of your identification document and a recent selfie.
          </li>
          <li>
            Blockpass will securely process and review your information. You’ll receive updates on your status via email.
          </li>
        </ol>
        <p>
          Our streamlined process ensures your data is handled securely and privately. Blockpass adheres to stringent data protection standards, 
          and your information will only be used for verification purposes.
        </p>
      </section>

      <section className={styles.verification}>
        <h2>Get Started with KYC</h2>
        <p>
          Ready to unlock enhanced security and exclusive rewards? Begin your KYC process today to ensure you’re fully equipped for 
          the opportunities The Forge has to offer.
        </p>
        <Button
          id="blockpass-kyc-connect"
          btnName="Verify with Blockpass"
          onClick={loadBlockpassWidget}
          classStyle="kycButton"
          fontSize="1.5rem"
          paddingLeft="default"
          paddingRight="default"
          isActive={false}
        />
      </section>
    </div>
  );
};

export default KYCPage;
