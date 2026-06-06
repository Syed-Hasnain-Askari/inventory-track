import mongoose from "mongoose";
import connectDB from "../../lib/db";
import Category from "../../models/category";
import Product from "../../models/products";
import Order from "../../models/order";
import { AiCommandSchema, type AiCommand } from "./validator";
import { logAiAction } from "./auditLogger";

type ExecutionContext = {
	userId?: string | null;
	confirmed?: boolean;
	commandText?: string;
};

const ALLOWED_COLLECTIONS = new Set(["products", "orders", "category"]);
const SAFE_AGGREGATE_STAGES = new Set([
	"$match",
	"$group",
	"$sort",
	"$limit",
	"$project",
	"$addFields",
	"$unwind"
]);

function normalizeCollectionName(value: string) {
	return value.toLowerCase().trim();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}

function containsDangerousKeys(value: unknown): boolean {
	if (!isPlainObject(value) && !Array.isArray(value)) {
		return false;
	}

	const forbiddenKeys = new Set([
		"$where",
		"$function",
		"$accumulator",
		"$merge",
		"$out",
		"$lookup",
		"$graphLookup",
		"$unionWith",
		"$facet",
		"$densify",
		"$fill",
		"$setWindowFields",
		"$redact"
	]);

	if (Array.isArray(value)) {
		return value.some((item) => containsDangerousKeys(item));
	}

	for (const [key, nestedValue] of Object.entries(value)) {
		if (forbiddenKeys.has(key)) {
			return true;
		}
		if (containsDangerousKeys(nestedValue)) {
			return true;
		}
	}

	return false;
}

function hasMeaningfulFilter(filter: Record<string, unknown>) {
	return Object.keys(filter).length > 0;
}

function mapStatusAlias(value: unknown) {
	if (typeof value !== "string") {
		return value;
	}

	if (value.toLowerCase() === "completed") {
		return "delivered";
	}

	return value;
}

async function resolveCategoryFilter(filter: Record<string, unknown>) {
	if (typeof filter.category !== "string") {
		return { filter, categoryNotFound: null };
	}

	const categoryValue = String(filter.category);
	if (mongoose.Types.ObjectId.isValid(categoryValue)) {
		return {
			...filter,
			category: new mongoose.Types.ObjectId(categoryValue)
		};
	}

	const category = await Category.findOne({
		$or: [
			{ slug: categoryValue },
			{
				name: new RegExp(
					`^${categoryValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
					"i"
				)
			}
		]
	}).select("_id");

	if (!category) {
		return { filter, categoryNotFound: categoryValue };
	}

	return {
		filter: {
			...filter,
			category: category._id
		},
		categoryNotFound: null
	};
}

function normalizeUpdate(update: Record<string, unknown>) {
	const normalized = clone(update);

	const hasOperatorKeys = Object.keys(normalized).some((key) =>
		key.startsWith("$")
	);
	if (!hasOperatorKeys && Object.keys(normalized).length > 0) {
		return {
			$set: normalized
		};
	}

	if (hasOperatorKeys) {
		const directFields = Object.fromEntries(
			Object.entries(normalized).filter(([key]) => !key.startsWith("$"))
		);

		if (Object.keys(directFields).length > 0) {
			normalized.$set = {
				...(isPlainObject(normalized.$set) ? normalized.$set : {}),
				...directFields
			};

			for (const key of Object.keys(directFields)) {
				delete normalized[key];
			}
		}
	}

	if (
		normalized.$set &&
		isPlainObject(normalized.$set) &&
		"status" in normalized.$set
	) {
		normalized.$set.status = mapStatusAlias(normalized.$set.status);
	}

	if (normalized.status) {
		normalized.status = mapStatusAlias(normalized.status);
	}

	return normalized;
}

function slugifyCategoryName(name: string) {
	return name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "");
}

function normalizeCategoryUpdate(update: Record<string, unknown>) {
	const normalized = normalizeUpdate(update);
	const nameFromSet =
		isPlainObject(normalized.$set) && typeof normalized.$set.name === "string"
			? normalized.$set.name
			: null;
	const directName =
		typeof normalized.name === "string" ? normalized.name : null;
	const nextName = nameFromSet || directName;

	if (nextName) {
		if (!isPlainObject(normalized.$set)) {
			normalized.$set = {};
		}
		(normalized.$set as Record<string, unknown>).slug =
			slugifyCategoryName(nextName);
	}

	return normalized;
}

function requiresConfirmation(command: AiCommand) {
	if (
		command.operation === "deleteMany" ||
		command.operation === "updateMany"
	) {
		return true;
	}

	if (command.operation === "updateOne" && command.update) {
		const update = command.update;
		const priceChanging =
			Boolean(
				update.$set && isPlainObject(update.$set) && "price" in update.$set
			) ||
			Boolean(
				update.$inc && isPlainObject(update.$inc) && "price" in update.$inc
			) ||
			Boolean(
				update.$mul && isPlainObject(update.$mul) && "price" in update.$mul
			) ||
			Boolean(
				update.$set &&
				isPlainObject(update.$set) &&
				"discountPrice" in update.$set
			);
		const stockChanging =
			Boolean(
				update.$set && isPlainObject(update.$set) && "stock" in update.$set
			) ||
			Boolean(
				update.$inc && isPlainObject(update.$inc) && "stock" in update.$inc
			) ||
			Boolean(
				update.$mul && isPlainObject(update.$mul) && "stock" in update.$mul
			);

		if (priceChanging || stockChanging) {
			return true;
		}
	}

	const update = command.update;
	if (update && isPlainObject(update)) {
		const bulkPriceChange =
			Boolean(
				update.$set && isPlainObject(update.$set) && "price" in update.$set
			) ||
			Boolean(
				update.$inc && isPlainObject(update.$inc) && "price" in update.$inc
			) ||
			Boolean(
				update.$mul && isPlainObject(update.$mul) && "price" in update.$mul
			);
		const bulkStockChange =
			Boolean(
				update.$set && isPlainObject(update.$set) && "stock" in update.$set
			) ||
			Boolean(
				update.$inc && isPlainObject(update.$inc) && "stock" in update.$inc
			) ||
			Boolean(
				update.$mul && isPlainObject(update.$mul) && "stock" in update.$mul
			);

		if (bulkPriceChange || bulkStockChange) {
			return true;
		}
	}

	if (
		typeof command.thresholdPercent === "number" &&
		command.thresholdPercent > 20
	) {
		return true;
	}

	return Boolean(command.requiresConfirmation);
}

function buildTimeWindowFilter(
	filter: Record<string, unknown>,
	timeWindowDays?: number
) {
	if (!timeWindowDays) {
		return filter;
	}

	const cutoff = new Date(Date.now() - timeWindowDays * 24 * 60 * 60 * 1000);
	const nextFilter = { ...filter };

	if ("createdAt" in nextFilter && isPlainObject(nextFilter.createdAt)) {
		nextFilter.createdAt = {
			...(nextFilter.createdAt as Record<string, unknown>),
			$lt: cutoff
		};
	} else if (!("createdAt" in nextFilter)) {
		nextFilter.createdAt = { $lt: cutoff };
	}

	return nextFilter;
}

async function buildProductFilter(command: AiCommand) {
	let filter = { ...(command.filter || {}) };
	let categoryNotFound: string | null = null;

	if ("category" in filter) {
		const resolved = await resolveCategoryFilter(filter);
		filter = resolved.filter;
		categoryNotFound = resolved.categoryNotFound;
	}

	filter = buildTimeWindowFilter(filter, command.timeWindowDays);
	return { filter, categoryNotFound };
}

function buildOrderAnalyticsPipeline(command: AiCommand) {
	const filter = buildTimeWindowFilter(
		{ ...(command.filter || {}) },
		command.timeWindowDays
	);

	switch (command.analysisType) {
		case "inactive_customers": {
			const windowDays = command.timeWindowDays || 90;
			const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
			return [
				{
					$group: {
						_id: "$customer.email",
						customer: { $first: "$customer" },
						lastOrderAt: { $max: "$createdAt" },
						totalOrders: { $sum: 1 },
						totalSpent: { $sum: "$total" }
					}
				},
				{
					$match: {
						lastOrderAt: { $lt: cutoff }
					}
				},
				{
					$sort: { lastOrderAt: 1 }
				},
				{
					$limit: command.limit || 50
				},
				{
					$project: {
						_id: 0,
						email: "$_id",
						customer: 1,
						lastOrderAt: 1,
						totalOrders: 1,
						totalSpent: 1
					}
				}
			];
		}
		case "top_spenders": {
			const limit = command.limit || 10;
			return [
				{
					$group: {
						_id: "$customer.email",
						customer: { $first: "$customer" },
						totalSpent: { $sum: "$total" },
						totalOrders: { $sum: 1 }
					}
				},
				{ $sort: { totalSpent: -1 } },
				{ $limit: limit },
				{
					$project: {
						_id: 0,
						email: "$_id",
						customer: 1,
						totalSpent: 1,
						totalOrders: 1
					}
				}
			];
		}
		case "pending_orders_older_than": {
			const windowDays = command.timeWindowDays || 7;
			const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
			return [
				{
					$match: {
						...(filter || {}),
						status: "pending",
						createdAt: { $lt: cutoff }
					}
				},
				{ $sort: { createdAt: 1 } },
				{ $limit: command.limit || 50 }
			];
		}
		default:
			return command.pipeline || [];
	}
}

function validateAggregatePipeline(pipeline: Record<string, unknown>[]) {
	for (const stage of pipeline) {
		if (!isPlainObject(stage)) {
			throw new Error("Aggregate pipeline stages must be plain objects.");
		}

		const stageName = Object.keys(stage)[0];
		if (!stageName || !SAFE_AGGREGATE_STAGES.has(stageName)) {
			throw new Error(
				`Unsafe aggregate stage detected: ${stageName || "unknown"}`
			);
		}
	}
}

function summarizePreview(count: number, command: AiCommand) {
	if (command.operation === "deleteMany") {
		return `This will delete ${count} ${command.entity} record${count === 1 ? "" : "s"}.`;
	}

	return `This will update ${count} ${command.entity} record${count === 1 ? "" : "s"}.`;
}

function formatLabelList(items: string[]) {
	return items.filter(Boolean).slice(0, 5).join(", ");
}

function summarizeFindResults(records: unknown, collectionName: string) {
	if (!Array.isArray(records) || records.length === 0) {
		return `Found 0 ${collectionName} record(s).`;
	}

	if (collectionName === "products") {
		const names = records
			.map((record) =>
				isPlainObject(record) ? String(record.name || "").trim() : ""
			)
			.filter(Boolean);

		return names.length
			? `Found ${records.length} product record(s): ${formatLabelList(names)}.`
			: `Found ${records.length} product record(s).`;
	}

	if (collectionName === "category") {
		const names = records
			.map((record) =>
				isPlainObject(record) ? String(record.name || "").trim() : ""
			)
			.filter(Boolean);

		return names.length
			? `Found ${records.length} category record(s): ${formatLabelList(names)}.`
			: `Found ${records.length} category record(s).`;
	}

	if (collectionName === "orders") {
		const orderLabels = records
			.map((record) => {
				if (!isPlainObject(record)) return "";
				const orderNumber = record.orderNumber
					? String(record.orderNumber).trim()
					: "";
				const customer = isPlainObject(record.customer)
					? `${String(record.customer.firstName || "").trim()} ${String(record.customer.lastName || "").trim()}`.trim()
					: "";
				return orderNumber || customer;
			})
			.filter(Boolean);

		return orderLabels.length
			? `Found ${records.length} order record(s): ${formatLabelList(orderLabels)}.`
			: `Found ${records.length} order record(s).`;
	}

	return `Found ${records.length} ${collectionName} record(s).`;
}

export async function executeAiCommand(
	rawCommand: AiCommand,
	context: ExecutionContext = {}
) {
	await connectDB();

	const command = AiCommandSchema.parse(rawCommand);
	const collectionName = normalizeCollectionName(
		command.collection || command.entity
	);

	if (!ALLOWED_COLLECTIONS.has(collectionName)) {
		throw new Error(`Collection ${collectionName} is not allowed.`);
	}

	if (containsDangerousKeys(command)) {
		throw new Error("Dangerous MongoDB operators are not allowed.");
	}

	const confirmationRequired = requiresConfirmation(command);
	const commandText = context.commandText || command.humanReadable;

	const previewBase = {
		intent: command.intent,
		entity: command.entity,
		operation: command.operation,
		humanReadable: command.humanReadable,
		requiresConfirmation: confirmationRequired
	};

	try {
		if (collectionName === "products") {
			const { filter, categoryNotFound } = await buildProductFilter(command);

			if (categoryNotFound) {
				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result: {
						preview: `Category "${categoryNotFound}" was not found. No product records matched.`,
						result: []
					}
				});

				return {
					...previewBase,
					preview: `Category "${categoryNotFound}" was not found. No product records matched.`,
					result: []
				};
			}

			if (command.operation === "find" || command.operation === "findOne") {
				const query =
					command.operation === "findOne"
						? Product.findOne(filter)
						: Product.find(filter);
				if (command.projection) {
					query.select(command.projection);
				}
				if (command.sort) {
					query.sort(command.sort);
				}
				if (command.limit) {
					query.limit(command.limit);
				} else if (command.operation === "find") {
					query.limit(50);
				}

				const result = await query.exec();

				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result
				});

				return {
					...previewBase,
					preview: summarizeFindResults(result, "products"),
					result
				};
			}

			if (
				command.operation === "updateOne" ||
				command.operation === "updateMany" ||
				command.operation === "deleteMany"
			) {
				const matches = await Product.countDocuments(filter);

				if (!context.confirmed && confirmationRequired) {
					const preview = summarizePreview(matches, command);
					await logAiAction({
						userId: context.userId || null,
						command: commandText,
						intent: command.intent,
						stage: "preview",
						result: { ...previewBase, preview, matchedCount: matches }
					});

					return {
						...previewBase,
						preview,
						matchedCount: matches
					};
				}

				if (!hasMeaningfulFilter(filter)) {
					throw new Error("Refusing to run an unfiltered write operation.");
				}

				if (command.operation === "deleteMany") {
					const result = await Product.deleteMany(filter);
					await logAiAction({
						userId: context.userId || null,
						command: commandText,
						intent: command.intent,
						stage: "executed",
						result
					});

					return {
						...previewBase,
						result
					};
				}

				const update = normalizeUpdate(command.update || {});
				if (!isPlainObject(update) || Object.keys(update).length === 0) {
					throw new Error("Update payload is required for write operations.");
				}

				const result =
					command.operation === "updateOne"
						? await Product.updateOne(filter, update)
						: await Product.updateMany(filter, update);

				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result
				});

				return {
					...previewBase,
					result
				};
			}
		}

		if (collectionName === "category") {
			const filter = buildTimeWindowFilter(
				command.filter || {},
				command.timeWindowDays
			);

			if (command.operation === "find" || command.operation === "findOne") {
				const query =
					command.operation === "findOne"
						? Category.findOne(filter)
						: Category.find(filter);
				if (command.projection) {
					query.select(command.projection);
				}
				if (command.sort) {
					query.sort(command.sort);
				}
				if (command.limit) {
					query.limit(command.limit);
				} else if (command.operation === "find") {
					query.limit(50);
				}

				const result = await query.exec();

				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result
				});

				return {
					...previewBase,
					preview: summarizeFindResults(result, "category"),
					result
				};
			}

			if (
				command.operation === "updateOne" ||
				command.operation === "updateMany" ||
				command.operation === "deleteMany"
			) {
				const matches = await Category.countDocuments(filter);

				if (!context.confirmed && confirmationRequired) {
					const preview = summarizePreview(matches, command);
					await logAiAction({
						userId: context.userId || null,
						command: commandText,
						intent: command.intent,
						stage: "preview",
						result: { ...previewBase, preview, matchedCount: matches }
					});

					return {
						...previewBase,
						preview,
						matchedCount: matches
					};
				}

				if (!hasMeaningfulFilter(filter)) {
					throw new Error("Refusing to run an unfiltered write operation.");
				}

				if (command.operation === "deleteMany") {
					const result = await Category.deleteMany(filter);
					await logAiAction({
						userId: context.userId || null,
						command: commandText,
						intent: command.intent,
						stage: "executed",
						result
					});

					return {
						...previewBase,
						result
					};
				}

				const update = normalizeCategoryUpdate(command.update || {});
				if (!isPlainObject(update) || Object.keys(update).length === 0) {
					throw new Error("Update payload is required for write operations.");
				}

				const result =
					command.operation === "updateOne"
						? await Category.updateOne(filter, update)
						: await Category.updateMany(filter, update);

				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result
				});

				return {
					...previewBase,
					result
				};
			}
		}

		if (collectionName === "orders") {
			if (command.operation === "aggregate") {
				const pipeline: any =
					command.analysisType === "inactive_customers" ||
					command.analysisType === "top_spenders" ||
					command.analysisType === "pending_orders_older_than"
						? buildOrderAnalyticsPipeline(command)
						: command.pipeline || [];

				if (!pipeline.length) {
					throw new Error(
						"Aggregate requires a safe analytics pattern or a non-empty pipeline."
					);
				}

				validateAggregatePipeline(pipeline);

				const result = await Order.aggregate(pipeline);

				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result
				});

				return {
					...previewBase,
					preview: `Aggregate query returned ${result.length} record(s).`,
					result
				};
			}

			const filter = buildTimeWindowFilter(
				command.filter || {},
				command.timeWindowDays
			);

			if (command.operation === "find" || command.operation === "findOne") {
				const query =
					command.operation === "findOne"
						? Order.findOne(filter)
						: Order.find(filter);
				if (command.projection) {
					query.select(command.projection);
				}
				if (command.sort) {
					query.sort(command.sort);
				}
				if (command.limit) {
					query.limit(command.limit);
				} else if (command.operation === "find") {
					query.limit(50);
				}

				const result = await query.exec();

				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result
				});

				return {
					...previewBase,
					preview: summarizeFindResults(result, "orders"),
					result
				};
			}

			if (
				command.operation === "updateOne" ||
				command.operation === "updateMany"
			) {
				const matches = await Order.countDocuments(filter);

				if (!context.confirmed && confirmationRequired) {
					const preview = summarizePreview(matches, command);
					await logAiAction({
						userId: context.userId || null,
						command: commandText,
						intent: command.intent,
						stage: "preview",
						result: { ...previewBase, preview, matchedCount: matches }
					});

					return {
						...previewBase,
						preview,
						matchedCount: matches
					};
				}

				if (!hasMeaningfulFilter(filter)) {
					throw new Error("Refusing to run an unfiltered write operation.");
				}

				const update = normalizeUpdate(command.update || {});
				if (!isPlainObject(update) || Object.keys(update).length === 0) {
					throw new Error("Update payload is required for write operations.");
				}

				const result =
					command.operation === "updateOne"
						? await Order.updateOne(filter, update)
						: await Order.updateMany(filter, update);

				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result
				});

				return {
					...previewBase,
					result
				};
			}

			if (command.operation === "deleteMany") {
				const matches = await Order.countDocuments(filter);

				if (!context.confirmed && confirmationRequired) {
					const preview = summarizePreview(matches, command);
					await logAiAction({
						userId: context.userId || null,
						command: commandText,
						intent: command.intent,
						stage: "preview",
						result: { ...previewBase, preview, matchedCount: matches }
					});

					return {
						...previewBase,
						preview,
						matchedCount: matches
					};
				}

				if (!hasMeaningfulFilter(filter)) {
					throw new Error("Refusing to run an unfiltered delete operation.");
				}

				const result = await Order.deleteMany(filter);
				await logAiAction({
					userId: context.userId || null,
					command: commandText,
					intent: command.intent,
					stage: "executed",
					result
				});

				return {
					...previewBase,
					result
				};
			}
		}

		throw new Error(
			`Operation ${command.operation} is not supported for ${collectionName}.`
		);
	} catch (error) {
		await logAiAction({
			userId: context.userId || null,
			command: commandText,
			intent: command.intent,
			stage: "failed",
			result: {
				message: error instanceof Error ? error.message : "Unknown error"
			}
		});
		throw error;
	}
}
