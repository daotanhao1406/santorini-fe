import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nmjolpfzcuotompbhwba.supabase.co',
      },
    ],
  },

  webpack(config, { isServer, webpack }) {
    // --- PHẦN 1: Xử lý Warning Supabase Realtime ---
    // Chỉ áp dụng khi build phía server để tránh lỗi thiếu module 'ws'
    if (isServer) {
      config.externals.push({
        bufferutil: 'commonjs bufferutil',
        'utf-8-validate': 'commonjs utf-8-validate',
      })
    }

    // Bỏ qua cảnh báo cho các module optional này
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^bufferutil|utf-8-validate$/,
      }),
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        loader: '@svgr/webpack',
        options: {
          dimensions: false,
          titleProp: true,
        },
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

export default withNextIntl(nextConfig)
