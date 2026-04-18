"use server";
import mongoose from "mongoose";
import User, { where } from "../../models/users";
import { cookies } from "next/headers";
import connectDB from "../db";
import { verifyToken } from "../session";
import { redirect } from "next/navigation";

export async function getUserDetails() {
	const sessionCookie = (await cookies()).get("session")?.value;
	console.log(sessionCookie, "sessionCookie");

	await connectDB();

	const { isAuth, userId } = await verifyToken(sessionCookie);
	if (!isAuth) {
		return null;
	}

	// Ensure `userId` is cast to ObjectId correctly in the query
	const user = await User.findOne()
		.where({ _id: new mongoose.Types.ObjectId(userId) })
		.select("-password");
	return user;
}
