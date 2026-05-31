import { v2 as cloudinary } from "cloudinary";
const fs = require("fs");
cloudinary.config({
	secure: true,
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});
export const uploadOnCloudinary = async (localFilePath) => {
	try {
		console.log(localFilePath, "localFilePath===");

		if (!localFilePath) return null;
		//upload the file on cloudinary
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto"
		});
		// file has been uploaded successfull
		console.log("file is uploaded on cloudinary ", response.url);
		fs.unlinkSync(localFilePath);
		return response;
	} catch (error) {
		fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
		return null;
	}
};

/**
 * Delete an image from Cloudinary
 * @param {string} url - The secure_url of the image
 */
export const deleteFromCloudinary = async (url) => {
	try {
		if (!url) return null;

		// Extract public_id from URL
		// Example URL: https://res.cloudinary.com/demo/image/upload/v1570975164/sample.jpg
		// public_id would be 'sample' (or 'folder/sample' if in a folder)
		const parts = url.split("/");
		const filename = parts[parts.length - 1];
		const publicId = filename.split(".")[0];

		// If there are folders, they are between 'upload/vXXXXXXXX/' and the filename
		// However, simple extraction usually works if not nested deeply or if we know the structure.
		// A more robust way is to find the index of 'upload/' and take everything after 'vXXXXXXXX/'
		const uploadIndex = parts.findIndex((part) => part === "upload");
		if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
			// parts[uploadIndex + 1] is usually 'vXXXXXXXX' or a transformation string
			// We take everything from uploadIndex + 2 to the end, then remove extension
			const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
			const publicId = publicIdWithExt.split(".")[0];
			const response = await cloudinary.uploader.destroy(publicId);
			return response;
		}

		const response = await cloudinary.uploader.destroy(publicId);
		return response;
	} catch (error) {
		console.error("Error deleting from Cloudinary:", error);
		return null;
	}
};

