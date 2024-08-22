"use client";
import ProductCard from "../../components/ProductCard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/Spinner";
import { getProducts } from "../../redux/feature/slice/inventrySlice";
import GridList from "@/app/components/GridList";
import { useToast } from "@/components/ui/use-toast";
import { deleteProductById } from "@/redux/feature/reducer/inventryReducer";
export const Products = ({ data }) => {
	const dispatch = useDispatch();
	const { toast } = useToast();
	const { inventryProducts, isLoading } = useSelector(
		(state) => state.inventry
	);
	const { isGrid } = useSelector((state) => state.global);
	console.log(inventryProducts, "inventryProducts====");
	const handleDeleteProduct = (id) => {
		try {
			dispatch(deleteProductById(id));
			toast({
				title: "Success!",
				description: "Product deleted successfully!"
			});
		} catch (error) {
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request."
			});
		}
	};
	useEffect(() => {
		if (data) {
			dispatch(getProducts(data));
		}
	}, [dispatch, data]);
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
					inventryProducts?.map((product) => {
						return isGrid ? (
							<GridList
								id={product?._id}
								name={product?.name}
								description={product?.description}
								image={product?.image}
								price={product?.price}
								handleDeleteProduct={handleDeleteProduct}
							/>
						) : (
							<ProductCard
								id={product?._id}
								name={product?.name}
								description={product?.description}
								image={product?.image}
								price={product?.price}
								category={product?.category}
								handleDeleteProduct={handleDeleteProduct}
								manufacture={product?.manufacture}
							/>
						);
					})
				)}
				{inventryProducts?.length === 0 && (
					<div className="col-span-12 py-32">
						<div className="flex justify-center items-center h-full">
							<p className=" text-gray-500 font-semibold">No products found</p>
						</div>
					</div>
				)}
			</div>
		</React.Fragment>
	);
};
