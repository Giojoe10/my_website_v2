/** @type {import('next').NextConfig} */

const nextConfig: import("next").NextConfig = {
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
};

export default nextConfig;
