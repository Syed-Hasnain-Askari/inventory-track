export default function DashboardLayout({
	children,
	latestproduct,
	stats
}) {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
				<p className="text-zinc-500 dark:text-zinc-400">
					Welcome back! Here&apos;s what&apos;s happening with your inventory today.
				</p>
			</div>

			<section>
				{stats}
			</section>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
				<div className="lg:col-span-8">
					{latestproduct}
				</div>
				<div className="lg:col-span-4">
					<div className="h-full rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center p-6 text-center">
						<div className="space-y-2">
							<p className="text-sm font-medium text-zinc-500">Analytics Chart Placeholder</p>
							<p className="text-xs text-zinc-400 max-w-[200px]">
								Interactive charts and detailed analytics will appear here.
							</p>
						</div>
					</div>
				</div>
			</div>
			{children}
		</div>
	);
}
