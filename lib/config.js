export function getBaseUrl() {
	if (typeof window !== "undefined") {
		return "";
	}

	const devUrl = (process.env.DEV_URL || "").trim().replace(/\/$/, "");

	if (process.env.NEXT_PUBLIC_APP_URL) {
		return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "");
	}

	if (process.env.NODE_ENV !== "production" && devUrl) {
		return devUrl;
	}

	if (process.env.VERCEL_URL) {
		const vercelUrl = process.env.VERCEL_URL.trim().replace(/\/$/, "");
		return vercelUrl.startsWith("http://") || vercelUrl.startsWith("https://")
			? vercelUrl
			: `https://${vercelUrl}`;
	}

	return devUrl || "http://localhost:3000";
}

export const BASE_URL = getBaseUrl();
