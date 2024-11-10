import Image from "next/image";
import { Button } from "../../components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "../../components/ui/table";

export function Product({ product }) {
	return (
		<TableRow>
			<TableCell className="hidden sm:table-cell">
				<Image
					alt="Product image"
					className="aspect-square rounded-md object-cover"
					height="64"
					src={product.image}
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button aria-haspopup="true" size="icon">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem>
							<form>
								<button type="submit">Delete</button>
							</form>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}