/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione ou modifique a seção 'images' aqui
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/**',
      },
      {
        // Adicione também o domínio do Cloudinary, já que você o usa
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ...outras configurações que você possa ter...
};

export default nextConfig;