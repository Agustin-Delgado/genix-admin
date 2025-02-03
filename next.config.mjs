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
  }
};

export default nextConfig;
