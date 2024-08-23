export default function DashboardLayout({
	children,
	latestproduct,
	manufacture,
	stats
}) {
	return (
		<div>
			<div>{children}</div>
			{stats}
			<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
				<div className="col-span-6 xl:col-span-6">{manufacture}</div>
				<div className="col-span-6 xl:col-span-6">{latestproduct}</div>
			</div>
		</div>
	);
}
