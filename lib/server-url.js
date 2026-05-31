import { headers } from "next/headers";

export function getServerBaseUrl() {
	try {
		const headerStore = headers();
		const host =
			headerStore.get("x-forwarded-host") ||
			headerStore.get("host") ||
			"";
		const proto =
			headerStore.get("x-forwarded-proto") ||
			(process.env.NODE_ENV === "production" ? "https" : "http");

		if (host) {
			return `${proto}://${host}`.replace(/\/$/, "");
		}
	} catch (error) {
		// Fall back to environment-based resolution below.
	}

	if (process.env.NEXT_PUBLIC_APP_URL) {
		return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "");
	}

	if (process.env.VERCEL_URL) {
		const vercelUrl = process.env.VERCEL_URL.trim().replace(/\/$/, "");
		return vercelUrl.startsWith("http://") || vercelUrl.startsWith("https://")
			? vercelUrl
			: `https://${vercelUrl}`;
	}

	return "http://localhost:3000";
}
