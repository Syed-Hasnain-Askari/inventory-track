import React from "react";
import DashboardLayout from "./layout";
import { getServerSession } from "next-auth";
export default async function Dashboard({ children }) {
	const session = await getServerSession();
	console.log(session, "session dashboard");
	if (session === null) {
		return <p>Access Denied</p>;
	}
	return <DashboardLayout>{children}</DashboardLayout>;
}
