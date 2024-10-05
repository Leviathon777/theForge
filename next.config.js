require('dotenv').config();

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'ipfs.nftstorage.link', 'nft.storage', 'firebasestorage.googleapis.com', 'lh3.googleusercontent.com',  'azure-selfish-swift-703.mypinata.cloud', 'https://azure-selfish-swift-703.mypinata.cloud'],
    formats: ["image/webp"],
  },
  webpack: (config) => {
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
