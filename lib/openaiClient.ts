import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.GROQ_BASE_URL || "";
const defaultModel = process.env.MODEL;

const normalizedBaseURL = baseURL.replace(/\/$/, "");

const llmClient = {
	chat: {
		completions: {
			create: async (payload: {
				model?: string;
				messages: Array<{ role: string; content: string }>;
				temperature?: number;
				response_format?: { type: "json_object" };
			}) => {
				if (!apiKey) {
					throw new Error(
						"OPENAI_API_KEY is not set in environment variables."
					);
				}

				const response = await fetch(`${normalizedBaseURL}/chat/completions`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${apiKey}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						model: payload.model || defaultModel,
						messages: payload.messages,
						temperature: payload.temperature ?? 0.1,
						response_format: payload.response_format || { type: "json_object" }
					})
				});

				if (!response.ok) {
					const errorBody = await response.text();
					throw new Error(
						`LLM request failed (${response.status}): ${errorBody || response.statusText}`
					);
				}

				return response.json();
			}
		}
	}
};

export default llmClient;
