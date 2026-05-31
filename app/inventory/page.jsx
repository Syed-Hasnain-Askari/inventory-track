import React from "react";
import { StatsSection } from "../../components/ProductInventry/StatsSection";
import { InventoryContent } from "../../components/ProductInventry/InventoryContent";
import Pagination from "../../components/pagination/index";
import InventoryLayout from "./InventoryLayout";
import { cookies } from "next/headers";
import { getServerBaseUrl } from "../../lib/server-url";

async function fetchData() {
	try {
		const session = (await cookies()).get("session")?.value;
		const baseUrl = getServerBaseUrl();
		const response = await fetch(`${baseUrl}/api/products/`, {
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`
			},
			credentials: "include",
			cache: "no-store"
		});
		return await response.json();
	} catch (error) {
		console.error("Failed to load inventory products:", error);
		return { success: false, result: [], pagination: { totalProducts: 0 } };
	}
}

const InventoryPage = async () => {
	const response = await fetchData();
	console.log(response, "Response");
	return (
		<InventoryLayout className="bg-zinc-50 dark:bg-zinc-950">
			<div className="space-y-6">
				<StatsSection data={response?.result} />
				<InventoryContent data={response} />
				{response?.pagination?.totalProducts > 10 && (
					<div className="flex justify-end mt-4">
						<Pagination />
					</div>
				)}
			</div>
		</InventoryLayout>
	);
};

export default InventoryPage;
