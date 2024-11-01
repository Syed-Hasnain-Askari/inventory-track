import React from "react";
import SignIn from "../../components/signin";
export default function SignInPage({ toggleToSignUp }) {
	return (
		<React.Fragment>
			<SignIn toggleToSignUp={toggleToSignUp} />
		</React.Fragment>
	);
}
