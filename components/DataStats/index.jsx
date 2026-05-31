import React from "react";
import StatsCard from "./StatsCard";
import { ShoppingCart, DollarSign, Package, Users } from "lucide-react";

const DataStatsOne = ({ data }) => {
	const {
		totalProduct = 0,
		totalCustomers = 0,
		totalOrders = 0,
		totalRevenue = 0
	} = data || {};

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
			<StatsCard
				icon={<ShoppingCart />}
				color="#10b981"
				title="Total Orders"
				value={totalOrders}
				trend={{ value: 12, isUp: true }}
			/>
			<StatsCard
				icon={<DollarSign />}
				color="#f59e0b"
				title="Total Revenue"
				value={`$${Number(totalRevenue || 0).toLocaleString()}`}
				trend={{ value: 8, isUp: true }}
			/>
			<StatsCard
				icon={<Package />}
				color="#8b5cf6"
				title="Catalog Products"
				value={totalProduct}
				trend={{ value: 2, isUp: false }}
			/>
			<StatsCard
				icon={<Users />}
				color="#06b6d4"
				title="Total Customers"
				value={totalCustomers}
				trend={{ value: 5, isUp: true }}
			/>
		</div>
	);
};

export default DataStatsOne;
