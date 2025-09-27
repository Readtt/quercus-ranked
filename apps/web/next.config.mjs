/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  async redirects() {
    return [
      {
        source: '/extension',
        destination: 'https://chromewebstore.google.com/detail/quercus-ranked/ebjlhhfdbijmgdaeaeffgahbimkbbgik',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
