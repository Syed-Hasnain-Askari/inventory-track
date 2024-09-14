import Redis from "ioredis";
export const createRedisInstance = () => {
	const redisClient = new Redis({
		host: process.env.REDIS_URL,
		port: process.env.REDIS_PORT, // Remote Redis port
		password: REDIS_PASSWORD // Add your Redis password
	});
	try {
		redisClient.on("connect", () => {
			console.log("Connected to Redis");
		});
		redisClient.on("error", (err) => {
			console.error("Error connecting to Redis:", err);
		});
		return redisClient;
	} catch (e) {
		throw new Error(`[Redis] Could not create a Redis instance`);
	}
};
