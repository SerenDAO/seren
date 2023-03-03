/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.io',
      },
      {
        protocol: 'https',
        hostname: '*.io',
      },
    ],
    // domains: ['infura.com', 'ipfs.io', 'ipfs.infura.io', 'ipfs.infura.io'],
  },

  // async headers() {
  //   return [
  //     {
  //       source: "/font/Kalam/Kalam-Regular.woff",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //       ],
  //     },
  //   ]
  // },

  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        // {
        //   source: '/some-page',
        //   destination: '/somewhere-else',
        //   has: [{ type: 'query', key: 'overrideMe' }],
        // }
      ],
      afterFiles: [
        // These rewrites are checked after pages/public files
        // are checked but before dynamic routes
        // {
        //   source: '/',
        //   destination: '/',
        // },
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: "/:id",
          destination: "/circle/:id",
        }
      ]
    }
  },
}

module.exports = nextConfig
