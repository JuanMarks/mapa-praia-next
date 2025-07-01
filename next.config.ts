import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Você pode usar 'http' se precisar, mas 'https' é mais seguro
        hostname: '**',   // O curinga para permitir qualquer hostname
      },
      {
        protocol: 'http', // Adicione este bloco se também precisar de http
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;