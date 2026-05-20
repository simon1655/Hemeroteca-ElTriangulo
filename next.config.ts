/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  outputFileTracingExcludes: {
    '*': ['data/noticias/**']
  }
}

module.exports = nextConfig