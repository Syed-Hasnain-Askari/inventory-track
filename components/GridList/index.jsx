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
import thumbnail from "@/public/images/no-image.jpg";

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
			<div className="bg-white dark:bg-zinc-950 mt-3">
				<div className="flex h-full mb-3 shadow-lg rounded-2xl border border-zinc-200 dark:border-zinc-800">
					<Link key={index} href={`/inventory/${id}`} className="w-full">
						<div className="flex w-full h-full p-2">
							<Image
								className="mr-4 rounded-lg object-cover object-center h-24 w-24"
								alt={name}
								width={100}
								height={100}
								loading="lazy"
								src={image || thumbnail}
							/>
							<div className="flex flex-col justify-between py-2 w-full">
								<div className="flex justify-between items-center mr-2">
									<h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate">
										{name}
									</h2>
								</div>
								<p className="text-xs text-zinc-500 line-clamp-2">
									{description}
								</p>
								<div className="flex justify-between items-center mr-2">
									<p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
										${price}
									</p>
								</div>
							</div>
						</div>
					</Link>
					<div className="p-2">
						<AlertDialog>
							<Menubar className="border-none bg-transparent">
								<MenubarMenu>
									<MenubarTrigger className="focus:bg-zinc-100 dark:focus:bg-zinc-800 rounded-full h-8 w-8 flex items-center justify-center p-0">
										<EllipsisVertical className="w-5 h-5 text-zinc-500 cursor-pointer" />
									</MenubarTrigger>
									<MenubarContent align="end" className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl">
										<MenubarItem asChild className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900">
											<Link href={`/inventory/edit/${id}`} key={id}>
												Edit Product
											</Link>
										</MenubarItem>
										<AlertDialogTrigger asChild>
											<MenubarItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20">Delete Product</MenubarItem>
										</AlertDialogTrigger>
									</MenubarContent>
								</MenubarMenu>
							</Menubar>

							<AlertDialogContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										your product from the server.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel className="font-semibold">Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											handleDeleteProduct(id);
										}}
										className="bg-red-600 text-white hover:bg-red-700 font-semibold"
									>
										Delete
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
