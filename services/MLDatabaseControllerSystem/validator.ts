import { z } from "zod";

export const CollectionNameSchema = z.enum(["products", "orders", "category"]);

export const OperationSchema = z.enum([
	"find",
	"findOne",
	"updateOne",
	"updateMany",
	"aggregate",
	"deleteMany"
]);

const JsonObjectSchema = z.record(z.any());
const JsonOperatorValueSchema = z.union([z.literal(0), z.literal(1)]);

export const AiCommandSchema = z
	.object({
		intent: z.string().min(1),
		entity: CollectionNameSchema,
		collection: CollectionNameSchema.optional(),
		operation: OperationSchema,
		filter: JsonObjectSchema.default({}),
		update: JsonObjectSchema.optional(),
		pipeline: z.array(JsonObjectSchema).optional(),
		sort: z.record(z.union([z.literal(1), z.literal(-1)])).optional(),
		projection: z.record(JsonOperatorValueSchema).optional(),
		limit: z.number().int().positive().max(500).optional(),
		analysisType: z.string().optional(),
		timeWindowDays: z.number().int().positive().max(3650).optional(),
		thresholdPercent: z.number().positive().max(100).optional(),
		humanReadable: z.string().min(1),
		preview: z.string().optional(),
		requiresConfirmation: z.boolean(),
		notes: z.string().optional()
	})
	.strict();

export const AiCommandRequestSchema = z
	.object({
		command: z.string().min(1),
		confirmed: z.boolean().optional(),
		structuredCommand: AiCommandSchema.optional()
	})
	.strict();

export type AiCommand = z.infer<typeof AiCommandSchema>;
export type AiCommandRequest = z.infer<typeof AiCommandRequestSchema>;

