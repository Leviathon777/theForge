require('dotenv').config();

module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none';" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: 'ipfs.nftstorage.link' },
      { protocol: 'https', hostname: 'nft.storage' },

      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'azure-selfish-swift-703.mypinata.cloud' },
    ],
    formats: ["image/webp"],
  },
  webpack: (config) => {
    // Ignore optional wagmi connectors that aren't installed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      porto: false,
      "porto/internal": false,
      "@coinbase/wallet-sdk": false,
      "@metamask/connect-evm": false,
      "@base-org/account": false,
    };
    config.externals = config.externals || [];
    config.externals.push("porto", "porto/internal");
    config.module.rules.push({
      test: /\.(mp4|webm|avi|mov|mkv|flv|wmv|m4v|3gp|3g2|ogv|mpg|mpeg|swf)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "videos/",
          publicPath: "/videos",
          
        },
      },
    });
    return config;
  },
};
