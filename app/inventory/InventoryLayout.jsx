import React from "react";
import { Header as ProductInventryHeader } from "../../components/ProductInventry/Header";
import { Sider } from "../../components/ProductInventry/Sider";
const InventoryLayout = ({ children }) => {
	return (
		<div className="grid grid-cols-12 gap-4">
			<div className="col-span-12">
				<ProductInventryHeader />
			</div>
			<aside className="lg:col-span-3 col-span-12 w-full sm:w-auto">
				<Sider />
			</aside>
			<main className="lg:col-span-9 col-span-12 sm:w-auto">{children}</main>
		</div>
	);
};

export default InventoryLayout;
