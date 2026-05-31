"use client";
import ProductCard from "../../components/ProductCard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { getProducts } from "../../redux/feature/slice/inventrySlice";
import GridList from "../../components/GridList";
import { useToast } from "../../components/ui/use-toast";
import { deleteProductById } from "../../redux/feature/reducer/inventryReducer";
export default function Products() {
	const { categories } = useSelector((state) => state.category);

	const dispatch = useDispatch();
	const { toast } = useToast();
	const { inventryProducts, isLoading } = useSelector(
		(state) => state.inventry
	);
	const { isGrid } = useSelector((state) => state.global);
	const handleDeleteProduct = (id) => {
		try {
			dispatch(deleteProductById(id));
			toast({
				title: "Success!",
				variant: "success",
				description: "Product deleted successfully!"
			});
		} catch (error) {
			toast({
				title: "Uh oh! Something went wrong.",
				variant: "destructive",
				description: "There was a problem with your request."
			});
		}
	};
	console.log(state.inventry, "state.inventry");
	return (
		<React.Fragment>
			<div
				className={`${
					isGrid
						? ""
						: "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3"
				}`}
			>
				{isLoading ? (
					<div className="col-span-12 py-32">
						<div className="flex items-center justify-center h-full">
							<Spinner />
						</div>
					</div>
				) : (
					inventryProducts?.map((product, index) => {
						const categoryName = product?.category?.name || "Uncategorized";

						return isGrid ? (
							<GridList
								index={index}
								key={product?._id}
								id={product?._id}
								name={product?.name}
								description={product?.description}
								image={product?.image || product?.images?.[0]}
								price={product?.price}
								handleDeleteProduct={handleDeleteProduct}
							/>
						) : (
							<ProductCard
								index={index}
								key={product?._id}
								id={product?._id}
								name={product?.name}
								description={product?.description}
								image={product?.image || product?.images?.[0]}
								price={product?.price}
								category={categoryName}
								handleDeleteProduct={handleDeleteProduct}
							/>
						);
					})
				)}
				{inventryProducts?.length === 0 && !isLoading && (
					<div className="col-span-12 py-32">
						<div className="flex justify-center items-center h-full">
							<p className=" text-gray-500 font-semibold">No products found</p>
						</div>
					</div>
				)}
			</div>
		</React.Fragment>
	);
}
