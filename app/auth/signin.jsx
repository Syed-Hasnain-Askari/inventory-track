import React from "react";
import SignIn from "../../components/signin";
import { redirect, useRouter } from "next/navigation";
export default function SignInPage({ toggleToSignUp }) {
	return (
		<React.Fragment>
			<SignIn toggleToSignUp={toggleToSignUp} />
		</React.Fragment>
	);
}
