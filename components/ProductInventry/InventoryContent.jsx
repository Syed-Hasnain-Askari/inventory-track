"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductsTable } from "./ProductTable";
import Products from "./Products";
import { getProducts } from "../../redux/feature/slice/inventrySlice";

export const InventoryContent = ({ data }) => {
	console.log("InventoryContent", data);
	const dispatch = useDispatch();
	const { isGrid } = useSelector((state) => state.global);

	useEffect(() => {
		if (data) {
			dispatch(getProducts(data));
		}
	}, [dispatch, data]);

	return (
		<div className="space-y-6">{isGrid ? <Products /> : <ProductsTable />}</div>
	);
};
