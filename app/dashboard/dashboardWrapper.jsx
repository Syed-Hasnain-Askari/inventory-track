import { getUserDetails } from "../../lib/actions/getUserDetail";
import Providers from "../components/Provider";
import DashboardLayout from "./dashboardLayout";
const DashboardWrapper = async ({ children }) => {
	const user = await getUserDetails();
	console.log(user, "user===!!!");
	return (
		<Providers>
			<DashboardLayout children={children} user={user} />
		</Providers>
	);
};

export default DashboardWrapper;
