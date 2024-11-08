"use client";
import ProductCard from "../../components/ProductCard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { getProducts } from "../../redux/feature/slice/inventrySlice";
import GridList from "../../components/GridList";
import { useToast } from "../../components/ui/use-toast";
import { deleteProductById } from "../../redux/feature/reducer/inventryReducer";
import { ProductsTable } from "./ProductTable";
export default function Products({ data }) {
	const { categories } = useSelector((state) => state.category);
	const { manufactureList } = useSelector((state) => state.manufacture);

	const dispatch = useDispatch();
	const { toast } = useToast();
	const { inventryProducts, isLoading, isError } = useSelector(
		(state) => state.inventry
	);
	const { isGrid } = useSelector((state) => state.global);
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
	console.log(inventryProducts, "inventryProducts");
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
						// Find category name by matching product.category with categories._id
						const categoryName =
							categories?.result?.find(
								(cat) => cat._id === product?.category
							) || "Unknown Category";

						// Find manufacture name by matching product.manufacture with manufactureList._id
						const manufactureName =
							manufactureList?.find(
								(manuf) => manuf._id === product?.manufacture
							) || "Unknown Manufacturer";
						return isGrid ? (
							<GridList
								index={index}
								id={product?._id}
								name={product?.name}
								description={product?.description}
								image={product?.image}
								price={product?.price}
								handleDeleteProduct={handleDeleteProduct}
							/>
						) : (
							<ProductCard
								index={index}
								id={product?._id}
								name={product?.name}
								description={product?.description}
								image={product?.image}
								price={product?.price}
								category={categoryName?.name}
								handleDeleteProduct={handleDeleteProduct}
								manufacture={manufactureName?.name}
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
}
