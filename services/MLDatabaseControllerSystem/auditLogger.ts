import mongoose from "mongoose";
import connectDB from "../../lib/db";

const AuditSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
			index: true
		},
		command: {
			type: String,
			required: true
		},
		intent: {
			type: String,
			default: ""
		},
		stage: {
			type: String,
			enum: ["parsed", "preview", "executed", "blocked", "failed"],
			default: "parsed"
		},
		result: {
			type: mongoose.Schema.Types.Mixed,
			default: null
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	},
	{
		collection: "ai_audit_logs"
	}
);

const AuditLog =
	mongoose.models.AiAuditLog || mongoose.model("AiAuditLog", AuditSchema);

export async function logAiAction({
	userId,
	command,
	intent = "",
	stage = "parsed",
	result = null
}: {
	userId?: string | null;
	command: string;
	intent?: string;
	stage?: "parsed" | "preview" | "executed" | "blocked" | "failed";
	result?: unknown;
}) {
	try {
		await connectDB();

		await AuditLog.create({
			userId:
				userId && mongoose.Types.ObjectId.isValid(userId)
					? new mongoose.Types.ObjectId(userId)
					: null,
			command,
			intent,
			stage,
			result
		});
	} catch (error) {
		console.error("Failed to write AI audit log:", error);
	}
}
