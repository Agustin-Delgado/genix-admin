/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/users',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/s3-upload/:path*', // La ruta local que usará el cliente
        destination: 'https://genix-api-studies.s3.amazonaws.com/:path*' // La URL de S3
      }
    ]
  }
};

export default nextConfig;
