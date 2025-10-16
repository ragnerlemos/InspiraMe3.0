/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Adiciona a configuração para exportação estática
  output: 'export',
  transpilePackages: ['@motion-canvas/core', '@motion-canvas/2d', '@motion-canvas/player'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Desativa a otimização de imagem do Next.js, necessário para 'output: export'
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
