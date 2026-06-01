import React from "react";
import { getOrderById } from "../../actions/orderActions";
import OrderDetailClient from "../../../components/Order/OrderDetailClient";
import Link from "next/link";
import { ChevronLeft, CalendarOff } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default async function Page({ params }) {
	const { id } = await params;
	const response = await getOrderById(id);
	const order = response?.success ? response.result : null;

	if (!order) {
		return (
			<>
				<div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
					<div className="p-5 bg-red-50 dark:bg-red-950/20 rounded-full mb-4 text-red-600">
						<CalendarOff className="h-12 w-12 animate-bounce" />
					</div>
					<h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-2">
						Order Not Found
					</h2>
					<p className="text-zinc-500 max-w-sm mb-6 text-sm">
						The order ID{" "}
						<code className="px-1.5 py-0.5 font-mono text-xs bg-zinc-100 dark:bg-zinc-800 rounded">
							{id}
						</code>{" "}
						is invalid or the order has been removed.
					</p>
					<Button
						asChild
						variant="outline"
						className="rounded-xl border-zinc-200 dark:border-zinc-800 gap-2"
					>
						<Link href="/order">
							<ChevronLeft className="h-4 w-4" />
							Back to Orders List
						</Link>
					</Button>
				</div>
			</>
		);
	}

	return <OrderDetailClient initialOrder={order} />;
}

export const dynamic = "force-dynamic";
