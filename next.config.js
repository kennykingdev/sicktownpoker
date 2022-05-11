const { withSuperjson } = require('next-superjson');

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	webpack: withSuperjson()({}).webpack,
	poweredByHeader: false,
};

module.exports = nextConfig;
