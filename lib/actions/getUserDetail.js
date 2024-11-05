"use server";
import mongoose from "mongoose";
import User, { where } from "../../models/users";
import { cookies } from "next/headers";
import connectDB from "../db";
import { verifyToken } from "../session";

export async function getUserDetails(req) {
	const session = cookies().get("session")?.value;
	await connectDB();

	const { isAuth, userId } = await verifyToken(req, session);
	if (!isAuth) {
		return null; // Return null if user is not authenticated
	}
	// Ensure `userId` is cast to ObjectId correctly in the query
	const user = await User.findOne()
		.where({ _id: new mongoose.Types.ObjectId(userId) })
		.select("-password");
	return user;
}
