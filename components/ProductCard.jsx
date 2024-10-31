import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger
} from "./ui/menubar";
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
} from "./ui/alert-dialog";
import { EllipsisVertical } from "lucide-react";
export default function ProductCard({
	index,
	name,
	id,
	image,
	price,
	category,
	manufacture,
	handleDeleteProduct
}) {
	const truncate = (str, len) => {
		if (str?.length > len) {
			return str.slice(0, len) + "...";
		}
		return str;
	};
	console.log(id, "id");

	return (
		<React.Fragment>
			<div className="relative cursor-pointer shadow-xl mx-auto transform overflow-hidden rounded-lg bg-white dark:bg-slate-800">
				<div className="flex flex-row justify-between items-center">
					<div class=" bg-yellow-200 mt-3 ml-3 py-1.5 px-6 rounded-full">
						<p tabindex="0" class="focus:outline-none text-xs text-yellow-700">
							{manufacture}
						</p>
					</div>
					<div>
						<AlertDialog>
							<Menubar className="border-none">
								<MenubarMenu>
									<MenubarTrigger>
										<EllipsisVertical className="w-6 h-6 !text-gray-700 cursor-pointer" />
									</MenubarTrigger>
									<MenubarContent>
										<MenubarItem>
											<Link href={`/inventory/edit/${id}`} key={id}>
												Edit
											</Link>
										</MenubarItem>

										<AlertDialogTrigger asChild>
											<MenubarItem>Delete</MenubarItem>
										</AlertDialogTrigger>
									</MenubarContent>
								</MenubarMenu>
							</Menubar>

							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										your product from the server
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											handleDeleteProduct(id);
										}}
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>

				<Link href={`/inventory/${id}`} key={index}>
					<Image
						height={300}
						width={300}
						className="w-full object-cover object-center"
						src={image}
						alt="Product Image"
					/>
					<div className="p-4">
						<h2 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
							{truncate(name, 40)}
						</h2>
						<p className="mb-2 text-base dark:text-gray-300 text-gray-700">
							{category}
						</p>
						<div className="flex justify-between items-center">
							<p className="mr-2 text-lg font-medium text-gray-900 dark:text-white">
								${price}
							</p>

							<div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
								<svg
									width={12}
									height={12}
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10 3L4.5 8.5L2 6"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<h2 className="text-sm font-normal">In Stock</h2>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</React.Fragment>
	);
}
