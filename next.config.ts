import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Adicione esta seção de "images"
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '25.20.79.62',
        port: '3003',
        pathname: '/uploads/**', // Permite qualquer imagem dentro da pasta /uploads
      },
    ],
  },
};

export default nextConfig;