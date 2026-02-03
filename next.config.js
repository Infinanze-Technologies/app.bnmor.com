/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost','lh3.googleusercontent.com','mocky.io'], //Domain of image host
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@ant-design',
    'antd',
    'rc-*',
    'classnames',
    '@babel/runtime',
    'rc-checkbox',
    'rc-table',
    'rc-input',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'ajv',
    'ajv-keywords'
  ],
  modularizeImports: {
    '@ant-design/icons': {
      transform: '@ant-design/icons/es/icons/{{ member }}',
    },
    'antd': {
      transform: 'antd/es/{{ member }}',
      skipDefaultConversion: true
    },
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx']
    };
    
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });

    return config;
  },
}

module.exports = nextConfig