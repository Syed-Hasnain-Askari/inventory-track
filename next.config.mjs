/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "tailwindui.com"
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com"
			},
			{
				protocol: "https",
				hostname: "www.paklap.pk"
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com"
			},
			{
				protocol: "https",
				hostname: "s3-inventorymanagement.s3.us-east-2.amazonaws.com",
				port: "",
				pathname: "/**"
			}
		]
	}
};

export default nextConfig;
