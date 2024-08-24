import Image from "next/image";
const brandData = [
	{
		logo: "/images/brand/brand-01.svg",
		name: "Google",
		visitors: 3.5,
		revenues: "5,768",
		sales: 590,
		conversion: 4.8
	},
	{
		logo: "/images/brand/brand-02.svg",
		name: "X.com",
		visitors: 2.2,
		revenues: "4,635",
		sales: 467,
		conversion: 4.3
	},
	{
		logo: "/images/brand/brand-03.svg",
		name: "Github",
		visitors: 2.1,
		revenues: "4,290",
		sales: 420,
		conversion: 3.7
	},
	{
		logo: "/images/brand/brand-04.svg",
		name: "Vimeo",
		visitors: 1.5,
		revenues: "3,580",
		sales: 389,
		conversion: 2.5
	},
	{
		logo: "/images/brand/brand-05.svg",
		name: "Facebook",
		visitors: 1.2,
		revenues: "2,740",
		sales: 230,
		conversion: 1.9
	}
];
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
							Sold
						</h5>
					</div>
				</div>
				{data?.map((item, key) => (
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
							<p className="font-medium text-dark dark:text-white">10</p>
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
export default ProductTable;
