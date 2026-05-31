import React from "react";
import { Header as ProductInventoryHeader } from "../../components/ProductInventry/Header";
import { Sider } from "../../components/ProductInventry/Sider";
import { Toaster } from "../../components/ui/toaster";

const InventoryLayout = ({ children }) => {
	return (
		<>
			<Toaster />
			<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
				<ProductInventoryHeader />
				<div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
					<div className="grid grid-cols-12 gap-6 lg:gap-8">
						<aside className="col-span-12 lg:col-span-4 xl:col-span-3">
							<div className="sticky top-24">
								<Sider />
							</div>
						</aside>
						<main className="col-span-12 lg:col-span-8 xl:col-span-9">
							{children}
						</main>
					</div>
				</div>
			</div>
		</>
	);
};

export default InventoryLayout;
