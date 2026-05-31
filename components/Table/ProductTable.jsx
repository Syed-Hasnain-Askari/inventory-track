import Image from "next/image";
import Spinner from "../Spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProductTable = ({ data }) => {
	return (
		<Card className="border-none shadow-sm dark:bg-zinc-900">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-lg font-semibold">Latest Products</CardTitle>
				<Badge variant="outline" className="font-normal">
					Last 24 hours
				</Badge>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border dark:border-zinc-800 overflow-hidden">
					<Table>
						<TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
							<TableRow>
								<TableHead className="w-[80px]">Image</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Category</TableHead>
								<TableHead className="text-right">Price</TableHead>
								<TableHead className="text-right">Stock</TableHead>
								<TableHead className="text-center">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{!data ? (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center">
										<div className="flex items-center justify-center gap-2">
											<Spinner className="h-4 w-4" />
											<span>Loading products...</span>
										</div>
									</TableCell>
								</TableRow>
							) : data.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="h-24 text-center text-zinc-500"
									>
										No products found.
									</TableCell>
								</TableRow>
							) : (
								data.map((item) => (
									<TableRow
										key={item.id}
										className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
									>
										<TableCell>
											<div className="relative h-10 w-10 overflow-hidden rounded-md border dark:border-zinc-800">
												<Image
													src={item?.image || "/images/no-image.jpg"}
													alt={item?.name}
													fill
													className="object-cover"
												/>
											</div>
										</TableCell>
										<TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
											{item?.name}
										</TableCell>
										<TableCell>
											<Badge variant="secondary" className="font-normal">
												{item?.category}
											</Badge>
										</TableCell>
										<TableCell className="text-right font-medium">
											${item?.price}
										</TableCell>
										<TableCell className="text-right">{item?.stock}</TableCell>
										<TableCell className="text-center">
											<div className="flex justify-center">
												{item?.stock > 10 ? (
													<span className="flex h-2 w-2 rounded-full bg-emerald-500" />
												) : item?.stock > 0 ? (
													<span className="flex h-2 w-2 rounded-full bg-amber-500" />
												) : (
													<span className="flex h-2 w-2 rounded-full bg-rose-500" />
												)}
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};
export default ProductTable;
