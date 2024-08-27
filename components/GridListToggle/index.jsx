"use client";
import { setIsGrid } from "../../redux/feature/slice/globalSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function GridListToggle() {
	const dispatch = useDispatch();
	const { isGrid } = useSelector((state) => state.global);
	const handleGrid = () => {
		dispatch(setIsGrid(!isGrid));
	};
	return (
		<div className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex">
			<button
				className="inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-l-full px-4 py-2 active"
				id="grid"
				onClick={handleGrid}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={24}
					height={24}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="fill-current w-4 h-4 mr-2"
				>
					<rect x={3} y={3} width={7} height={7} />
					<rect x={14} y={3} width={7} height={7} />
					<rect x={14} y={14} width={7} height={7} />
					<rect x={3} y={14} width={7} height={7} />
				</svg>
				<span>Grid</span>
			</button>
			<button
				onClick={handleGrid}
				className="inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full px-4 py-2"
				id="list"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={24}
					height={24}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="fill-current w-4 h-4 mr-2"
				>
					<line x1={8} y1={6} x2={21} y2={6} />
					<line x1={8} y1={12} x2={21} y2={12} />
					<line x1={8} y1={18} x2={21} y2={18} />
					<line x1={3} y1={6} x2="3.01" y2={6} />
					<line x1={3} y1={12} x2="3.01" y2={12} />
					<line x1={3} y1={18} x2="3.01" y2={18} />
				</svg>
				<span>List</span>
			</button>
		</div>
	);
}
