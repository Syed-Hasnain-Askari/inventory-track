import React from "react";
import DashboardLayout from "./layout";
export default async function Dashboard({ children }) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
