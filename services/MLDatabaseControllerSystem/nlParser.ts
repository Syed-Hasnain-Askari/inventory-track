import { AiCommandSchema, type AiCommand } from "./validator";
import llmClient from "../../lib/openaiClient";

function normalizeCommandText(command: string) {
	return command.trim().replace(/\s+/g, " ");
}

function inferCategoryName(commandText: string) {
	const text = commandText.toLowerCase();
	const knownCategories = [
		"skincare",
		"electronics",
		"beauty",
		"fashion",
		"home",
		"grocery",
		"health",
		"toys",
		"sports"
	];

	return knownCategories.find((category) => text.includes(category)) || null;
}

function inferDays(commandText: string) {
	const match = commandText.match(/(\d+)\s+days?/i);
	return match ? Number(match[1]) : undefined;
}

function inferLimit(commandText: string) {
	const match = commandText.match(/top\s+(\d+)/i);
	return match ? Number(match[1]) : undefined;
}

function buildFallbackCommand(commandText: string): Partial<AiCommand> {
	const normalized = normalizeCommandText(commandText);
	const lower = normalized.toLowerCase();
	const category = inferCategoryName(normalized);
	const days = inferDays(normalized);
	const limit = inferLimit(normalized);

	if (
		/show|list|find|get|display|which|what/i.test(lower) &&
		/(product|products|inventory|stock)/i.test(lower)
	) {
		const stockQuery =
			/available\s+in\s+stock|in\s+stock|stocked|available products/i.test(
				lower
			);
		const highStockQuery = /stock\s+over\s+(\d+)|stock\s+above\s+(\d+)/i.test(
			lower
		);
		const stockThresholdMatch = lower.match(/stock\s+(?:over|above)\s+(\d+)/i);
		const threshold = stockThresholdMatch
			? Number(stockThresholdMatch[1])
			: undefined;

		return {
			intent: "PRODUCT_QUERY",
			entity: "products",
			operation: "find",
			filter: {
				...(category ? { category } : {}),
				...(stockQuery
					? { stock: { $gt: 0 }, isActive: true }
					: highStockQuery
						? { stock: { $gt: threshold || 0 } }
						: {})
			},
			sort: { createdAt: -1 },
			limit: limit || 20,
			requiresConfirmation: false,
			humanReadable: normalized
		};
	}

	if (/(customer|customers|ordered|spending|spenders|orders?)/i.test(lower)) {
		if (
			/top\s+\d+\s+high\s+spending|top\s+\d+\s+spending|high spending/i.test(
				lower
			)
		) {
			return {
				intent: "CUSTOMER_ANALYTICS",
				entity: "orders",
				operation: "aggregate",
				analysisType: "top_spenders",
				limit: limit || 10,
				filter: {},
				requiresConfirmation: false,
				humanReadable: normalized
			};
		}

		if (/haven'?t\s+ordered|inactive|no\s+orders|last\s+order/i.test(lower)) {
			return {
				intent: "CUSTOMER_ANALYTICS",
				entity: "orders",
				operation: "aggregate",
				analysisType: "inactive_customers",
				timeWindowDays: days || 90,
				filter: {},
				requiresConfirmation: false,
				humanReadable: normalized
			};
		}

		if (/pending\s+orders?.*older\s+than/i.test(lower)) {
			return {
				intent: "ORDER_QUERY",
				entity: "orders",
				operation: "find",
				filter: {
					status: "pending"
				},
				timeWindowDays: days || 7,
				requiresConfirmation: false,
				humanReadable: normalized
			};
		}

		if (/mark\s+all\s+delivered\s+orders?\s+as\s+completed/i.test(lower)) {
			return {
				intent: "ORDER_UPDATE",
				entity: "orders",
				operation: "updateMany",
				filter: {
					status: "delivered"
				},
				update: {
					$set: {
						status: "completed"
					}
				},
				requiresConfirmation: true,
				humanReadable: normalized
			};
		}
	}

	if (
		/(stock|units|price|discount|product|products|electronics|skincare|inventory)/i.test(
			lower
		)
	) {
		if (/reduce\s+stock/i.test(lower)) {
			const amount = Number(
				normalized.match(/reduce\s+stock.*?(\d+)/i)?.[1] || 0
			);
			return {
				intent: "UPDATE_PRODUCTS",
				entity: "products",
				operation: "updateMany",
				filter: category ? { category } : {},
				update: {
					$inc: {
						stock: amount || 10
					}
				},
				requiresConfirmation: true,
				humanReadable: normalized
			};
		}

		if (/add\s+\d+\s+units?/i.test(lower)) {
			const amount = Number(
				normalized.match(/add\s+(\d+)\s+units?/i)?.[1] || 0
			);
			return {
				intent: "UPDATE_PRODUCTS",
				entity: "products",
				operation: "updateMany",
				filter: category ? { category } : {},
				update: {
					$inc: {
						stock: amount || 10
					}
				},
				requiresConfirmation: true,
				humanReadable: normalized
			};
		}

		if (/increase\s+price/i.test(lower)) {
			const percent = Number(
				normalized.match(/(\d+(?:\.\d+)?)\s*%/i)?.[1] || 15
			);
			return {
				intent: "UPDATE_PRODUCTS",
				entity: "products",
				operation: "updateMany",
				filter: category ? { category } : {},
				update: {
					$mul: {
						price: 1 + percent / 100
					}
				},
				thresholdPercent: percent,
				requiresConfirmation: true,
				humanReadable: normalized
			};
		}

		if (/discount/i.test(lower)) {
			const percent = Number(
				normalized.match(/(\d+(?:\.\d+)?)\s*%/i)?.[1] || 20
			);
			return {
				intent: "UPDATE_PRODUCTS",
				entity: "products",
				operation: "updateMany",
				filter: category ? { category } : {},
				update: {
					$mul: {
						price: 1 - percent / 100
					}
				},
				thresholdPercent: percent,
				requiresConfirmation: true,
				humanReadable: normalized
			};
		}
	}

	return {
		intent: "GENERAL_QUERY",
		entity: "orders",
		operation: "find",
		filter: {},
		requiresConfirmation: false,
		humanReadable: normalized
	};
}

const SYSTEM_PROMPT = `You are a secure natural language database planner for an ecommerce admin dashboard.
Return STRICT JSON only. No markdown, no code fences, no extra commentary.

Allowed collections: products, orders, category
Allowed operations: find, findOne, updateOne, updateMany, aggregate, deleteMany

Safety rules:
- Never produce drop, dropDatabase, delete all, or unfiltered destructive operations.
- If an action changes many documents, set requiresConfirmation to true.
- UpdateMany always requires confirmation.
- DeleteMany always requires confirmation.
- Bulk price changes require confirmation.
- Any stock modification to many products requires confirmation.
- For update payloads, prefer MongoDB operators such as $set and $inc.
- Keep filters as specific as possible.
- For customer-related queries, use the orders collection because customer data is embedded there.
- Use analysisType for read-only analytics on orders when helpful.

Examples:
- "Add 50 units to all skincare products" => updateMany on products, filter by category, $inc stock by 50, requiresConfirmation true
- "Show me customers who haven't ordered in 90 days" => aggregate on orders, analysisType inactive_customers, timeWindowDays 90, requiresConfirmation false
- "List top 10 high spending customers" => aggregate on orders, analysisType top_spenders, limit 10, requiresConfirmation false
- "Show pending orders older than 7 days" => find on orders, filter pending status, timeWindowDays 7, requiresConfirmation false
- "Mark all delivered orders as completed" => updateMany on orders, filter delivered status, normalize completed to delivered if needed, requiresConfirmation true
`;

export async function parseNaturalLanguageCommand(
	command: string
): Promise<AiCommand> {
	const completion = await llmClient.chat.completions.create({
		messages: [
			{ role: "system", content: SYSTEM_PROMPT },
			{
				role: "user",
				content: `Convert this admin command into a safe MongoDB action plan:\n${command}`
			}
		],
		temperature: 0.1,
		response_format: { type: "json_object" }
	});

	const raw = completion?.choices?.[0]?.message?.content;
	if (!raw) {
		throw new Error("LLM returned an empty response.");
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		const match = raw.match(/\{[\s\S]*\}/);
		if (!match) {
			throw new Error("LLM did not return valid JSON.");
		}
		parsed = JSON.parse(match[0]);
	}

	const fallback = buildFallbackCommand(command);
	const merged =
		parsed && typeof parsed === "object" && !Array.isArray(parsed)
			? { ...fallback, ...parsed }
			: fallback;

	const safeResult = AiCommandSchema.safeParse(merged);
	if (safeResult.success) {
		return safeResult.data;
	}

	return AiCommandSchema.parse(fallback);
}
