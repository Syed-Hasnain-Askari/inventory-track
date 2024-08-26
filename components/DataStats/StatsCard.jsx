import React from "react";

export default function StatsCard({ icon, color, title, value }) {
	return (
		<div className="rounded-[10px] bg-white p-6 shadow-lg dark:bg-gray-dark">
			<div
				className="flex h-20 w-20 items-center justify-center rounded-full"
				style={{ backgroundColor: color }}
			>
				{icon}
			</div>

			<div className="mt-6 flex items-end justify-between">
				<div>
					<h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
						{value}
					</h4>
					<span className="text-body-sm font-medium">{title}</span>
				</div>
			</div>
		</div>
	);
}
