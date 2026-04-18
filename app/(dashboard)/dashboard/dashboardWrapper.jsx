import { getUserDetails } from "../../lib/actions/getUserDetail";
import Providers from "../../components/Provider";
import DashboardLayout from "./dashboardLayout";
const DashboardWrapper = async ({ children }) => {
	const user = await getUserDetails();
	return (
		<Providers>
			<DashboardLayout children={children} username={user?.username} />
		</Providers>
	);
};

export default DashboardWrapper;
