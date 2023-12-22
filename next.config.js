/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      // apple playlist thumbnails
      "is1-ssl.mzstatic.com",
      // spotify playlist thumbnails
      "mosaic.scdn.co",
      "i.scdn.co",
    ],
  },
};

module.exports = nextConfig;
