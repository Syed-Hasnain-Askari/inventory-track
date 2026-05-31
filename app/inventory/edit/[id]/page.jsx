import React from "react";
import { getProductById } from "@/app/actions/productActions";
import ProductEditForm from "@/components/ProductInventry/ProductEditForm";
import InventoryLayout from "@/app/inventory/InventoryLayout";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
	const { id } = await params;
	const result = await getProductById(id);
	console.log(result,"Result")
	if (!result || !result.success) {
		notFound();
	}

	return (
		<InventoryLayout>
			<ProductEditForm product={result.result} />
		</InventoryLayout>
	);
}
