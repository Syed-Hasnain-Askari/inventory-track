import React from "react";
import DashboardLayout from "./layout";
import { getServerSession } from "next-auth";
import { authOPtions } from "../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
export default async function Dashboard({ children }) {
	const session = await getServerSession(authOPtions);
	console.log(session, "session dashboard");
	if (!session) {
		redirect("/signin");
	}
	return <DashboardLayout>{children}</DashboardLayout>;
}
