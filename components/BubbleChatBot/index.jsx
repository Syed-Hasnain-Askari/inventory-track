"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Bot,
	CheckCircle2,
	Database,
	Loader2,
	Send,
	ShieldAlert,
	Sparkles,
	X
} from "lucide-react";
import "./chatbot.css";

const initialMessages = [
	{
		id: "welcome",
		sender: "ai",
		kind: "info",
		title: "AI Admin Console",
		text:
			"I can safely parse inventory, product, category, and order commands. Try asking me to update stock, change prices, or inspect order analytics."
	}
];

const BubbleChatBot = () => {
	const router = useRouter();
	const [messages, setMessages] = useState(initialMessages);
	const [input, setInput] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [pendingAction, setPendingAction] = useState(null);
	const [error, setError] = useState("");

	const isBusy = isLoading;
	const isInputBlocked = isLoading || Boolean(pendingAction);

	const appendMessage = (message) => {
		setMessages((prev) => [
			...prev,
			{
				id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
				...message
			}
		]);
	};

	const sendCommand = async ({
		commandText,
		confirmed = false,
		structuredCommand = null
	}) => {
		setError("");
		setIsLoading(true);

		try {
			const requestPayload = {
				command: commandText,
				confirmed
			};

			if (structuredCommand) {
				requestPayload.structuredCommand = structuredCommand;
			}

			const response = await fetch("/api/ai-command", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				credentials: "include",
				body: JSON.stringify(requestPayload)
			});

			const payload = await response.json();

			if (!response.ok || !payload?.success) {
				throw new Error(payload?.message || "Failed to process command.");
			}

			return payload.result;
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const commandText = input.trim();
		if (!commandText || isInputBlocked) return;

		appendMessage({
			sender: "user",
			kind: "text",
			text: commandText
		});

		setInput("");
		setPendingAction(null);

		try {
			const result = await sendCommand({ commandText });

			if (result.requiresConfirmation) {
				setPendingAction({
					commandText,
					command: result.command,
					preview: result.preview,
					intent: result.intent,
					entity: result.entity,
					operation: result.operation,
					matchedCount: result.matchedCount || 0
				});

				appendMessage({
					sender: "ai",
					kind: "preview",
					title: "Confirmation required",
					text: result.preview || "Please confirm this database action.",
					meta: {
						intent: result.intent,
						entity: result.entity,
						operation: result.operation,
						matchedCount: result.matchedCount || 0
					}
				});
				return;
			}

			appendMessage({
				sender: "ai",
				kind: "success",
				title: "Command executed",
				text: result.preview || "The operation completed successfully.",
				meta: {
					intent: result.intent,
					entity: result.entity,
					operation: result.operation
				}
			});

			router.refresh();
		} catch (submitError) {
			const message =
				submitError instanceof Error
					? submitError.message
					: "Something went wrong while handling the command.";

			setError(message);
			appendMessage({
				sender: "ai",
				kind: "error",
				title: "Request failed",
				text: message
			});
		}
	};

	const handleConfirm = async () => {
		if (!pendingAction || isLoading) return;

		try {
			const result = await sendCommand({
				commandText: pendingAction.commandText,
				confirmed: true,
				structuredCommand: pendingAction.command
			});

			appendMessage({
				sender: "ai",
				kind: "success",
				title: "Action completed",
				text: result.preview || "The database action completed successfully.",
				meta: {
					intent: result.intent,
					entity: result.entity,
					operation: result.operation
				}
			});

			setPendingAction(null);
			router.refresh();
		} catch (confirmError) {
			const message =
				confirmError instanceof Error
					? confirmError.message
					: "Failed to execute the confirmed command.";
			setError(message);
			appendMessage({
				sender: "ai",
				kind: "error",
				title: "Execution failed",
				text: message
			});
		}
	};

	const headerSummary = useMemo(() => {
		if (pendingAction) {
			return `${pendingAction.entity} - ${pendingAction.operation}`;
		}
		return "AI command center";
	}, [pendingAction]);

	return (
		<>
			<button
				className="fixed bottom-4 right-4 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-zinc-950 text-white shadow-2xl shadow-black/30 transition hover:scale-105 hover:bg-zinc-900"
				type="button"
				aria-label={isOpen ? "Close AI command console" : "Open AI command console"}
				aria-expanded={isOpen}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				{isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
			</button>

			{isOpen ? (
				<div className="fixed bottom-[5.5rem] right-4 top-4 z-50 flex w-[min(92vw,32rem)] max-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
					<div className="border-b border-white/10 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 px-5 py-4">
						<div className="flex items-start justify-between gap-4">
							<div>
								<div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
									<Sparkles className="h-3.5 w-3.5" />
									Admin AI Control
								</div>
								<h2 className="text-lg font-semibold tracking-tight">
									Natural Language Database Control
								</h2>
								<p className="mt-1 text-sm text-zinc-400">{headerSummary}</p>
							</div>
							<div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-300">
								<Database className="h-5 w-5" />
							</div>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto scrollbar-custom px-4 py-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`mb-4 flex gap-3 ${
									message.sender === "user" ? "justify-end" : "justify-start"
								}`}
							>
								{message.sender === "ai" ? (
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200">
										<Bot className="h-4.5 w-4.5" />
									</div>
								) : null}

								<div
									className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
										message.sender === "user"
											? "rounded-br-md bg-emerald-500/15 text-emerald-50"
											: message.kind === "error"
												? "border border-rose-500/20 bg-rose-500/10 text-rose-50"
												: message.kind === "preview"
													? "border border-amber-400/20 bg-amber-400/10 text-amber-50"
													: message.kind === "success"
														? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-50"
														: "border border-white/10 bg-white/5 text-zinc-100"
									}`}
								>
									{message.title ? (
										<div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
											{message.kind === "preview" ? (
												<ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
											) : message.kind === "success" ? (
												<CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
											) : null}
											{message.title}
										</div>
									) : null}

									<p>{message.text}</p>

									{message.meta ? (
										<div className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-300">
											<div className="flex items-center justify-between gap-3">
												<span className="text-zinc-400">Intent</span>
												<span className="font-medium text-zinc-100">
													{message.meta.intent}
												</span>
											</div>
											<div className="flex items-center justify-between gap-3">
												<span className="text-zinc-400">Entity</span>
												<span className="font-medium text-zinc-100">
													{message.meta.entity}
												</span>
											</div>
											<div className="flex items-center justify-between gap-3">
												<span className="text-zinc-400">Operation</span>
												<span className="font-medium text-zinc-100">
													{message.meta.operation}
												</span>
											</div>
											{typeof message.meta.matchedCount === "number" ? (
												<div className="flex items-center justify-between gap-3">
													<span className="text-zinc-400">Matches</span>
													<span className="font-medium text-zinc-100">
														{message.meta.matchedCount}
													</span>
												</div>
											) : null}
										</div>
									) : null}
								</div>

								{message.sender === "user" ? (
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/15 text-emerald-200">
										You
									</div>
								) : null}
							</div>
						))}

						{pendingAction ? (
							<div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
								<div className="mb-2 flex items-center gap-2 font-semibold">
									<ShieldAlert className="h-4 w-4" />
									Confirmation required
								</div>
								<p className="text-amber-50/90">
									{pendingAction.preview ||
										"This action needs confirmation before it runs."}
								</p>
								<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-amber-100/90">
									<span className="rounded-full border border-amber-300/20 px-2 py-1">
										{pendingAction.entity}
									</span>
									<span className="rounded-full border border-amber-300/20 px-2 py-1">
										{pendingAction.operation}
									</span>
									<span className="rounded-full border border-amber-300/20 px-2 py-1">
										{pendingAction.matchedCount} match(es)
									</span>
								</div>
								<div className="mt-4 flex gap-2">
									<button
										type="button"
										disabled={isBusy}
										onClick={handleConfirm}
										className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
									>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<CheckCircle2 className="h-4 w-4" />
										)}
										Confirm
									</button>
									<button
										type="button"
										disabled={isBusy}
										onClick={() => setPendingAction(null)}
										className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
									>
										Cancel
									</button>
								</div>
							</div>
						) : null}

						{isLoading ? (
							<div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
								<Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
								AI is thinking about the safest action...
							</div>
						) : null}

						{error ? (
							<div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
								{error}
							</div>
						) : null}
					</div>

					<div className="border-t border-white/10 bg-zinc-950 px-4 py-4">
						<form onSubmit={handleSubmit} className="flex items-center gap-2">
							<input
								className="h-11 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-emerald-400/40 focus:bg-white/10"
								placeholder="Ask me to update inventory, review orders, or change products..."
								value={input}
								onChange={(event) => setInput(event.target.value)}
								disabled={isInputBlocked}
							/>
							<button
								type="submit"
								disabled={isInputBlocked || !input.trim()}
								className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isLoading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Send className="h-4 w-4" />
								)}
								Send
							</button>
						</form>
						<div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
							<span>Only admin users can execute commands.</span>
							<span>Destructive actions always require confirmation.</span>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};

export default BubbleChatBot;
