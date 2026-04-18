export function getBaseUrl() {
	if (typeof window !== "undefined") {
		return "";
	}

	if (process.env.DEV_URL) {
		return process.env.DEV_URL;
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return process.env.DEV_URL || "http://localhost:3000";
}

export const BASE_URL = getBaseUrl();
