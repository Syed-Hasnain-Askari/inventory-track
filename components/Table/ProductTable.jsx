import Image from "next/image";
import Spinner from "../Spinner";
const ProductTable = ({ data }) => {
	return (
		<div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-lg dark:bg-gray-dark dark:shadow-card">
			<h4 className="mb-5.5 p-5 text-body-2xlg font-bold text-dark dark:text-white">
				Latest Products
			</h4>

			<div className="flex flex-col">
				<div className="grid grid-cols-3 sm:grid-cols-5">
					<div className="px-2 pb-3.5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Name
						</h5>
					</div>
					<div className="px-2 pb-3.5 text-center">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Category
						</h5>
					</div>
					<div className="px-2 pb-3.5 text-center">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Manufacture
						</h5>
					</div>
					<div className="hidden px-2 pb-3.5 text-center sm:block">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Price
						</h5>
					</div>
					<div className="hidden px-2 pb-3.5 text-center sm:block">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Stock
						</h5>
					</div>
				</div>
				{data?.map((item, key) =>
					data?.length < 0 ? (
						<>
							<div className="col-span-12 h-96">
								<div className="flex items-center justify-center h-full">
									<Spinner />
								</div>
							</div>
						</>
					) : (
						<div
							className={`grid grid-cols-3 sm:grid-cols-5 ${
								key === data.length - 1
									? ""
									: "border-b border-stroke dark:border-dark-3"
							}`}
							key={key}
						>
							<div className="flex items-center gap-3.5 px-2 py-4">
								<div className="flex-shrink-0">
									<Image src={item?.image} alt="Brand" width={48} height={48} />
								</div>
								<p className="hidden font-medium text-sm text-dark dark:text-white sm:block">
									{item?.name.slice(0, 10)}
								</p>
							</div>
							<div className="flex items-center justify-center px-2 py-4">
								<p className="font-medium text-dark dark:text-white">
									{item?.category}
								</p>
							</div>

							<div className="flex items-center justify-center px-2 py-4">
								<p className="font-medium text-green-light-1">
									{item?.manufacture}
								</p>
							</div>

							<div className="hidden items-center justify-center px-2 py-4 sm:flex">
								<p className="font-medium text-dark dark:text-white">
									${item?.price}
								</p>
							</div>

							<div className="hidden items-center justify-center px-2 py-4 sm:flex">
								<p className="font-medium text-dark dark:text-white">
									{item?.stock}
								</p>
							</div>
						</div>
					)
				)}
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
export default ProductTable;
