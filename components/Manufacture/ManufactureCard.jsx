import Image from "next/image";
import React from "react";
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
} from "../../components/ui/alert-dialog";

export default function ManufactureCard({
	id,
	name,
	email,
	phoneNumber,
	contactName,
	location,
	image,
	handleDeleteManufacture
}) {
	return (
		<>
			<div
				key={id}
				className="relative cursor-pointer shadow-xl mx-auto transform overflow-hidden rounded-lg bg-white dark:bg-slate-800"
			>
				<div className="absolute right-5 top-6">
					<AlertDialog>
						<AlertDialogTrigger>
							<svg
								class="w-6 h-6 text-gray-800 dark:text-white rounded-lg bg-gray-200 dark:bg-gray-800 p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="30"
								height="30"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
								/>
							</svg>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										handleDeleteManufacture(id);
									}}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
				<Image
					height={250}
					width={250}
					className="w-full object-cover object-center"
					src={image}
					alt="Product Image"
				/>

				<div className="p-4">
					<h2 tabIndex={0} className="focus:outline-none text-lg font-semibold">
						{name}
					</h2>
					<p className="text-sm dark:text-gray-300 text-gray-700">{location}</p>
					<p className="text-sm dark:text-gray-300 text-gray-700">{email}</p>
					<p className="text-sm dark:text-gray-300 text-gray-700">
						{contactName}
					</p>
					<p className="text-sm dark:text-gray-300 text-gray-700">
						{phoneNumber}
					</p>
				</div>
			</div>
		</>
	);
}
