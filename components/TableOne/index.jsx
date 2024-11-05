import Image from "next/image";
const TableOne = ({ data }) => {
	return (
		<div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-lg dark:bg-gray-dark dark:shadow-card">
			<h4 className="p-3 text-body-2xlg font-bold text-dark dark:text-white">
				Top Manufacture
			</h4>

			<div className="flex flex-col">
				<div className="grid grid-cols-3 sm:grid-cols-5">
					<div className="px-2 pb-3.5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Source
						</h5>
					</div>
					<div className="px-2 pb-3.5 text-center">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Total Products
						</h5>
					</div>
					<div className="px-2 pb-3.5 text-center">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Stock
						</h5>
					</div>
					<div className="hidden px-2 pb-3.5 text-center sm:block">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Sales
						</h5>
					</div>
					<div className="hidden px-2 pb-3.5 text-center sm:block">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Conversion
						</h5>
					</div>
				</div>

				{data?.map((brand, key) => (
					<div
						className={`grid grid-cols-3 sm:grid-cols-5 ${
							key === data?.length - 1
								? ""
								: "border-b border-stroke dark:border-dark-3"
						}`}
						key={key}
					>
						<div className="flex items-center gap-3.5 px-2 py-4">
							<div className="flex-shrink-0">
								<Image src={brand?.image} alt="Brand" width={48} height={48} />
							</div>
							<p className="hidden font-sm font-medium text-dark dark:text-white sm:block">
								{brand?.name}
							</p>
						</div>

						<div className="flex items-center justify-center px-2 py-4">
							<p className="font-medium text-center text-dark dark:text-white">
								{brand?.total_productCount}
							</p>
						</div>

						<div className="flex items-center justify-center px-2 py-4">
							<p className="font-medium text-green-light-1">
								{brand?.total_stock}
							</p>
						</div>

						<div className="hidden items-center justify-center px-2 py-4 sm:flex">
							<p className="font-medium text-dark dark:text-white">500</p>
						</div>

						<div className="hidden items-center justify-center px-2 py-4 sm:flex">
							<p className="font-medium text-dark dark:text-white">1.3%</p>
						</div>
					</div>
				))}
				{data?.length === 0 && (
					<div className="col-span-12 py-32">
						<div className="flex justify-center items-center h-full">
							<p className=" text-gray-500 font-semibold">No products found</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default TableOne;
