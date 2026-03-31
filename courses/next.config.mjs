/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	basePath: "/cursos",
	assetPrefix: "/cursos/",
	trailingSlash: true,
	images: {
		unoptimized: true
	}
};

export default nextConfig;