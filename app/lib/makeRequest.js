import axios from "axios";
const apiClient = axios.create({
	//baseURL: "https://financial-management-backend-one.vercel.app/", // Base API URL
	baseURL: "http://localhost:3000/", // Base API UR
	headers: {
		"Content-Type": "application/json"
	}
});
export const makeRequest = async (
	url,
	method = "get",
	data = null,
	customHeaders = {}
) => {
	try {
		const config = {
			url,
			method,
			data,
			headers: {
				...apiClient.defaults.headers,
				...customHeaders
			}
		};
		const response = await apiClient.request(config);
		return response.data;
	} catch (error) {
		console.error("Request Error:", error);
		throw error;
	}
};
