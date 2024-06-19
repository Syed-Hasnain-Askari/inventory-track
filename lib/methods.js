export const getProducts = async () => {
	const response = await fetch(
		"http://localhost:3000/api/products/getproduct",
		{
			cache: "no-store"
		}
	);
	return await response.json();
};
export const getCategories = async () => {
	const response = await fetch("http://localhost:3000/api/getcategories", {
		cache: "no-store"
	});
	return await response.json();
};
