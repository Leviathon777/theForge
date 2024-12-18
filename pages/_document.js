import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Blockpass KYC script */}
        <script
          src="https://cdn.blockpass.org/widget/scripts/release/3.0.2/blockpass-kyc-connect.prod.js"
          async
        ></script>

        {/* Transak SDK script */}
        <script async src="https://cdn.transak.com/js/sdk/1.4.1/transak.js"></script>

        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
