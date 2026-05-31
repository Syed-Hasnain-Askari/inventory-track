import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; // Assuming a Switch component for isActive

export function AddProductDialog() {
	// In a real application, you would manage state for these inputs
	// and handle form submission logic here.
	// For this redesign, we are focusing on the structure of the modal fields.

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Add New Product</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[475px] ">
				<DialogHeader>
					<DialogTitle>Product Information</DialogTitle>
					<DialogDescription>
						Enter product details below. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{/* Product Name */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="productName" className="text-right">
							Name
						</Label>
						<Input
							id="productName"
							placeholder="e.g., Laptop, T-Shirt"
							className="col-span-3"
							// defaultValue={product?.name || ""} // For editing
						/>
					</div>

					{/* Product Description */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="productDescription" className="text-right">
							Description
						</Label>
						<Input
							id="productDescription"
							placeholder="Detailed product description"
							className="col-span-3"
							// defaultValue={product?.description || ""}
						/>
					</div>

					{/* Product Price */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="productPrice" className="text-right">
							Price
						</Label>
						<Input
							id="productPrice"
							type="number"
							placeholder="e.g., 99.99"
							className="col-span-3"
							// defaultValue={product?.price || ""}
						/>
					</div>

					{/* Product Discount Price */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="productDiscountPrice" className="text-right">
							Discount Price
						</Label>
						<Input
							id="productDiscountPrice"
							type="number"
							placeholder="e.g., 79.99"
							className="col-span-3"
							// defaultValue={product?.discountPrice || ""}
						/>
					</div>

					{/* Product Stock */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="productStock" className="text-right">
							Stock
						</Label>
						<Input
							id="productStock"
							type="number"
							placeholder="e.g., 100"
							className="col-span-3"
							// defaultValue={product?.stock || 0}
						/>
					</div>

					{/* Product SKU */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="productSku" className="text-right">
							SKU
						</Label>
						<Input
							id="productSku"
							placeholder="e.g., LPT-123-BLK"
							className="col-span-3"
							// defaultValue={product?.sku || ""}
						/>
					</div>

					{/* Product Category - Placeholder for Select */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="productCategory" className="text-right">
							Category
						</Label>
						<Select /* defaultValue={product?.category?._id || ""} */>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{/* Example categories, these should be dynamically loaded */}
								<SelectItem value="electronics">Electronics</SelectItem>
								<SelectItem value="clothing">Clothing</SelectItem>
								<SelectItem value="books">Books</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Product Active Status - Placeholder for Switch */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="productIsActive" className="text-right">
							Active
						</Label>
						<Switch
							id="productIsActive"
							// checked={product?.isActive || true}
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Save Product</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
