import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    webpack: (config: { watchOptions: { poll: number; aggregateTimeout: number } }, { dev }: any) => {
        if (dev) {
            // Fix hot reload for docker
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };
        }
        return config;
    },
    images: {
        remotePatterns: [new URL("http://localhost:5000/**")],
    },
};

export default nextConfig;
