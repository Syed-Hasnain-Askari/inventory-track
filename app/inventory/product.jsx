import Image from "next/image";
import { TableCell, TableRow } from "../../components/ui/table";
import thumbnail from "../../public/images/no-image.jpg";
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
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger
} from "../../components/ui/menubar";
import { EllipsisVertical } from "lucide-react";
export function Product({ id, product, handleDeleteProduct }) {
	return (
		<TableRow>
			<TableCell className="hidden sm:table-cell">
				<Image
					alt="Product image"
					className="aspect-square rounded-md object-cover"
					height="64"
					src={product.image ? product.image : thumbnail}
					width="64"
				/>
			</TableCell>
			<TableCell className="font-medium">{product.name}</TableCell>

			<TableCell className="hidden md:table-cell">{`$${product.price}`}</TableCell>
			<TableCell className="hidden md:table-cell">{product.stock}</TableCell>
			<TableCell className="hidden md:table-cell">
				{product.createdAt}
			</TableCell>
			<TableCell>
				<AlertDialog>
					<Menubar className="border-none">
						<MenubarMenu style={{ backgroundColor: "#ffffff" }}>
							<MenubarTrigger>
								<EllipsisVertical className="w-6 h-6 !text-gray-700 cursor-pointer" />
							</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>Edit</MenubarItem>

								<AlertDialogTrigger asChild>
									<MenubarItem>Delete</MenubarItem>
								</AlertDialogTrigger>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>

					<AlertDialogContent style={{ backgroundColor: "#ffffff" }}>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								product from the server
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
			</TableCell>
		</TableRow>
	);
}
