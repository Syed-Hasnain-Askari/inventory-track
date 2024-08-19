"use client";
import ProductCard from "../../components/ProductCard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/Spinner";
import { getProducts } from "../../redux/feature/slice/inventrySlice";
export const Products = ({ data }) => {
	const dispatch = useDispatch();
	const { inventryProducts, isLoading } = useSelector(
		(state) => state.inventry
	);
	useEffect(() => {
		if (data) {
			dispatch(getProducts(data));
		}
	}, [dispatch, data]);
	return (
		<React.Fragment>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
				{isLoading ? (
					<div className="col-span-12 py-32">
						<div className="flex items-center justify-center h-full">
							<Spinner />
						</div>
					</div>
				) : (
					inventryProducts?.map((product) => {
						return (
							<ProductCard
								id={product._id}
								name={product.name}
								description={product.description}
								image={product.image}
								price={product.price}
								category={product.category}
								manufacture={product.manufacture}
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
