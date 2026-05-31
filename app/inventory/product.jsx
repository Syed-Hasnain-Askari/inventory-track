import Image from "next/image";
import { TableCell, TableRow } from "@/components/ui/table";
import thumbnail from "@/public/images/no-image.jpg";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Product({ id, product, handleDeleteProduct }) {
	console.log(product, "Product====");
	// Format date for display
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	// Determine stock status
	const getStockStatus = (stock) => {
		if (stock === 0)
			return {
				text: "Out of Stock",
				class:
					"bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
			};
		if (stock <= 5)
			return {
				text: "Low Stock",
				class:
					"bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
			};
		return {
			text: "In Stock",
			class:
				"bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
		};
	};

	const { text: stockText, class: stockClass } = getStockStatus(product.stock);

	return (
		<TableRow className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
			<TableCell className="pl-6 py-4">
				<div className="relative h-12 w-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
					<Image
						alt={`${product.name} image`}
						className="object-cover group-hover:scale-110 transition-transform duration-300"
						fill
						src={product.images ? product.images[0] : thumbnail}
						sizes="48px"
					/>
				</div>
			</TableCell>

			<TableCell className="py-4">
				<div className="flex flex-col">
					<Link
						href={`/inventory/${id}`}
						className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
					>
						{product.name}
					</Link>
					<span className="text-[10px] font-medium text-zinc-400 uppercase tracking-tighter md:hidden">
						{product.sku || "NO SKU"}
					</span>
				</div>
			</TableCell>

			<TableCell className="hidden md:table-cell py-4">
				<span className="text-xs font-mono font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
					{product.sku || "N/A"}
				</span>
			</TableCell>

			<TableCell className="hidden md:table-cell py-4">
				<span className="text-sm text-zinc-600 dark:text-zinc-400">
					{product.category?.name || "N/A"}
				</span>
			</TableCell>

			<TableCell className="py-4 text-right">
				<span className="font-bold text-zinc-900 dark:text-zinc-100">
					$
					{Number(product.price || 0).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</span>
			</TableCell>

			<TableCell className="py-4 text-center">
				<span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
					{product.stock}
				</span>
			</TableCell>

			<TableCell className="hidden md:table-cell py-4 text-center">
				<span
					className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${stockClass}`}
				>
					{stockText}
				</span>
			</TableCell>

			<TableCell className="hidden lg:table-cell py-4 text-center text-xs text-zinc-500 font-medium">
				{formatDate(product.updatedAt)}
			</TableCell>

			<TableCell className="pr-6 py-4 text-right">
				<AlertDialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
							>
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4 text-zinc-500" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-48 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl"
						>
							<DropdownMenuLabel className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-3 py-2">
								Actions
							</DropdownMenuLabel>
							<DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
							<DropdownMenuItem
								asChild
								className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900"
							>
								<Link
									href={`/inventory/${id}`}
									className="flex items-center gap-2 px-3 py-2 text-sm"
								>
									<ExternalLink className="h-4 w-4 text-zinc-400" />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								asChild
								className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900"
							>
								<Link
									href={`/inventory/edit/${id}`}
									className="flex items-center gap-2 px-3 py-2 text-sm"
								>
									<Edit className="h-4 w-4 text-zinc-400" />
									Edit Product
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
							<AlertDialogTrigger asChild>
								<DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20 px-3 py-2 text-sm">
									<div className="flex items-center gap-2">
										<Trash2 className="h-4 w-4" />
										Delete Product
									</div>
								</DropdownMenuItem>
							</AlertDialogTrigger>
						</DropdownMenuContent>
					</DropdownMenu>

					<AlertDialogContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
						<AlertDialogHeader>
							<AlertDialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
								Delete Product
							</AlertDialogTitle>
							<AlertDialogDescription className="text-zinc-500 dark:text-zinc-400">
								Are you sure you want to delete{" "}
								<span className="font-bold text-zinc-900 dark:text-zinc-200">
									"{product.name}"
								</span>
								? This action is permanent and cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter className="gap-2">
							<AlertDialogCancel className="rounded-xl border-zinc-200 dark:border-zinc-800 font-semibold">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => handleDeleteProduct(id)}
								className="bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold shadow-lg shadow-red-200 dark:shadow-none"
							>
								Delete Product
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</TableCell>
		</TableRow>
	);
}
