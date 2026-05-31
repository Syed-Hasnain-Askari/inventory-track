import React from "react";
import InventoryLayout from "../inventory/InventoryLayout";
import { getCategories } from "../actions/categoryActions";
import CategoryList from "../../components/Category/CategoryList";

const CategoriesPage = async () => {
	const result = await getCategories();
	const categories = result?.result || [];

	return (
		<InventoryLayout>
			<CategoryList categories={categories} />
		</InventoryLayout>
	);
};

export default CategoriesPage;
