import connectDB from "../../lib/db";
import User from "../../models/users";
import { apiHandler, ApiError } from "../../util/errorMiddleware";
import { verifyToken } from "../../lib/session";
import { AiCommandRequestSchema } from "../../services/MLDatabaseControllerSystem/validator";
import { parseNaturalLanguageCommand } from "../../services/MLDatabaseControllerSystem/nlParser";
import { executeAiCommand } from "../../services/MLDatabaseControllerSystem/dbExecutor";

async function getAuthenticatedAdmin(req: any) {
	const sessionToken = req.cookies?.session;
	const { isAuth, userId } =
		(await verifyToken(sessionToken)) as {
			isAuth: boolean;
			userId?: string | null;
		};

	if (!isAuth || !userId || typeof userId !== "string") {
		throw new ApiError(401, "Authentication required.");
	}

	await connectDB();

	const user = await User.findById(userId).select("role name email");
	if (!user) {
		throw new ApiError(401, "Authenticated user not found.");
	}

	return { userId, user };
}

export default apiHandler(async (req, res) => {
	if (req.method !== "POST") {
		throw new ApiError(405, `Method ${req.method} Not Allowed`);
	}

	const { userId } = await getAuthenticatedAdmin(req);
	const bodyResult = AiCommandRequestSchema.safeParse(req.body);
	if (!bodyResult.success) {
		throw new ApiError(400, "Invalid request payload.");
	}
	const body = bodyResult.data;

	const commandText = body.command.trim();

	if (body.confirmed) {
		if (!body.structuredCommand) {
			throw new ApiError(
				400,
				"Structured command is required to confirm execution."
			);
		}

		let result;
		try {
			result = await executeAiCommand(body.structuredCommand, {
				userId,
				confirmed: true,
				commandText
			});
		} catch (error) {
			throw new ApiError(
				400,
				error instanceof Error
					? error.message
					: "Unable to execute confirmed command."
			);
		}

		return res.success(
			{
				humanReadable: result.humanReadable,
				intent: result.intent,
				entity: result.entity,
				operation: result.operation,
				requiresConfirmation: false,
				result: result.result,
				preview: result.preview,
				command: body.structuredCommand
			},
			"Command executed successfully"
		);
	}

	let parsedCommand;
	try {
		parsedCommand = await parseNaturalLanguageCommand(commandText);
	} catch (error) {
		throw new ApiError(
			400,
			error instanceof Error
				? error.message
				: "Unable to parse the command safely."
		);
	}

	let executionPlan;
	try {
		executionPlan = await executeAiCommand(parsedCommand, {
			userId,
			confirmed: false,
			commandText
		});
	} catch (error) {
		throw new ApiError(
			400,
			error instanceof Error
				? error.message
				: "Unable to process the command safely."
		);
	}

	return res.success(
		{
			humanReadable: executionPlan.humanReadable,
			intent: executionPlan.intent,
			entity: executionPlan.entity,
			operation: executionPlan.operation,
			requiresConfirmation: executionPlan.requiresConfirmation,
			preview: executionPlan.preview,
			matchedCount: executionPlan.matchedCount || 0,
			command: parsedCommand
		},
		executionPlan.requiresConfirmation
			? "Confirmation required"
			: "Command parsed successfully"
	);
});
