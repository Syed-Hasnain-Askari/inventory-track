import Image from "next/image";
const brandData = [
	{
		logo: "/images/brand/brand-hp.svg",
		name: "HP",
		visitors: 3.5,
		revenues: "5,768",
		sales: 590,
		conversion: 4.8
	},
	{
		logo: "/images/brand/brand-microsoft.svg",
		name: "Microsoft",
		visitors: 2.2,
		revenues: "4,635",
		sales: 467,
		conversion: 4.3
	},
	{
		logo: "/images/brand/brand-apple.svg",
		name: "Apple",
		visitors: 2.1,
		revenues: "4,290",
		sales: 420,
		conversion: 3.7
	}
];

const TableOne = () => {
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
							Visitors
						</h5>
					</div>
					<div className="px-2 pb-3.5 text-center">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Revenues
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

				{brandData.map((brand, key) => (
					<div
						className={`grid grid-cols-3 sm:grid-cols-5 ${
							key === brandData.length - 1
								? ""
								: "border-b border-stroke dark:border-dark-3"
						}`}
						key={key}
					>
						<div className="flex items-center gap-3.5 px-2 py-4">
							<div className="flex-shrink-0">
								<Image src={brand.logo} alt="Brand" width={48} height={48} />
							</div>
							<p className="hidden font-sm font-medium text-dark dark:text-white sm:block">
								{brand.name}
							</p>
						</div>

						<div className="flex items-center justify-center px-2 py-4">
							<p className="font-medium text-center text-dark dark:text-white">
								{brand.visitors}K
							</p>
						</div>

						<div className="flex items-center justify-center px-2 py-4">
							<p className="font-medium text-green-light-1">
								${brand.revenues}
							</p>
						</div>

						<div className="hidden items-center justify-center px-2 py-4 sm:flex">
							<p className="font-medium text-dark dark:text-white">
								{brand.sales}
							</p>
						</div>

						<div className="hidden items-center justify-center px-2 py-4 sm:flex">
							<p className="font-medium text-dark dark:text-white">
								{brand.conversion}%
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default TableOne;
