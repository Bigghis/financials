/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      http: require.resolve("http")
     };

    return config;
  },
  /*node:{
    module: "empty"
 }*/
}

module.exports = nextConfig
