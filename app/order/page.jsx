import React from "react";
import { OrderTable } from "../../components/Order/OrderTable";
import { OrderStats } from "../../components/Order/OrderStats";
import InventoryLayout from "../inventory/InventoryLayout";
import { getOrders, getOrderStats } from "../actions/orderActions";
import Pagination from "../../components/pagination/index";

const OrderPage = async ({ searchParams }) => {
	const params = await searchParams;
	const orders = await getOrders(params);
	const stats = await getOrderStats();

	return (
		<InventoryLayout>
			<div className="space-y-6">
				<OrderStats stats={stats} />
				<OrderTable data={orders} />
				{orders?.pagination?.totalPages > 1 && (
					<div className="flex justify-end mt-4">
						<Pagination />
					</div>
				)}
			</div>
		</InventoryLayout>
	);
};

export default OrderPage;
