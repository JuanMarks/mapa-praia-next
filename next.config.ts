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
        protocol: 'https',
        hostname: 'cdn-user-icons.flaticon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-teste-production-e474.up.railway.app',
        port: '',
        pathname: '/**',
      },
      {
        
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        
        protocol: 'http',
        hostname: 'www.w3.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ...outras configurações que você possa ter...
};

export default nextConfig;