import React from "react";
import { StatsSection } from "../../components/ProductInventry/StatsSection";
import { InventoryContent } from "../../components/ProductInventry/InventoryContent";
import Pagination from "../../components/pagination/index";
import InventoryLayout from "./InventoryLayout";
import { BASE_URL } from "@/lib/config";
import { cookies } from "next/headers";

async function fetchData() {
	const session = (await cookies()).get("session")?.value;
	const response = await fetch(`${BASE_URL}/api/products/`, {
		headers: {
			"Content-Type": "application/json",
			Cookie: `session=${session}`
		},
		credentials: "include",
		cache: "no-store"
	});
	const result = await response.json();
	return result;
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
