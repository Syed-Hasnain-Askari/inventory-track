import * as React from "react";
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
} from "../ui/menubar";
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
} from "../ui/alert-dialog";
import { EllipsisVertical } from "lucide-react";
export default function GridList({
	index,
	name,
	id,
	image,
	price,
	description,
	handleDeleteProduct
}) {
	return (
		<React.Fragment>
			<div className="bg-white mt-3">
				<div className="flex h-full mb-3 shadow-lg rounded-2xl">
					<Link key={index} href={`/inventory/${id}/`} className="w-full">
						<div className="flex w-full h-full">
							<Image
								className="mr-4 rounded-lg object-cover object-center"
								alt="Image placeholder"
								width={100}
								height={100}
								loading="lazy"
								src={image}
							/>
							<div className="flex flex-col justify-between py-2 w-full">
								<div className="flex justify-between items-center mr-2">
									<div>
										<h2 className="text-lg font-medium text-gray-900 dark:text-white">
											{name}
										</h2>
									</div>
								</div>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
									{description}
								</p>
								<div className="flex justify-between items-center mr-2">
									<p className="text-lg font-medium text-gray-900 dark:text-white">
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
						</div>
					</Link>
					<div
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<AlertDialog>
							<Menubar className="border-none">
								<MenubarMenu>
									<MenubarTrigger>
										<EllipsisVertical className="w-6 h-6 !text-gray-700 cursor-pointer" />
									</MenubarTrigger>
									<MenubarContent>
										<MenubarItem>
											<Link href={`/productinventory/${id}`} key={id}>
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
										Ok
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
