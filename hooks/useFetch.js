"use client";
import React, { useState, useEffect } from "react";
export const useFetch = (url) => {
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(url, {
					cache: "no-store" // Ensures the fetch does not use any cache
				});
				if (!res.ok) {
					throw new Error("Failed to fetch data");
				}
				const data = await res.json();
				setResponse(data.result);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (url) {
			fetchData();
		}
	}, [url]);
	return {
		response,
		setResponse,
		error,
		loading
	};
};
