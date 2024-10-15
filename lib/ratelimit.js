import { createRedisInstance } from "../lib/redis";

const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute
const MAX_WINDOW_REQUEST_COUNT = 60; // 5 requests per window
const redisClient = createRedisInstance();
export const rateLimit = async (req, res, next) => {
	const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	try {
		const requests = await redisClient.get(ip);
		let requestCount = requests ? parseInt(requests, 10) : 0;

		if (requestCount >= MAX_WINDOW_REQUEST_COUNT) {
			return res
				.status(429)
				.json({ message: "Too many requests, please try again later." });
		} else {
			requestCount++;
			await redisClient.set(ip, requestCount, "EX", WINDOW_SIZE_IN_SECONDS); // Corrected usage
			next();
		}
	} catch (error) {
		console.error("Error in rate limiting middleware:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
