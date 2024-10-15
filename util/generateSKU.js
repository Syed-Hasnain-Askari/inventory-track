export const generateSKU = (name, uniqueID) => {
	const productName = name.substring(0, 3).toUpperCase();
	const id = uniqueID.substring(0, 6);
	const sku = `${productName}${id}`;

	return sku;
};
