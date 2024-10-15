import React from "react";
import DashboardLayout from "./layout";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
export default async function Dashboard({ children }) {
	const session = await getServerSession(authOptions);
	console.log(session, "session dashboard");
	if (!session) {
		redirect("/signin");
	}
	return <DashboardLayout>{children}</DashboardLayout>;
}
