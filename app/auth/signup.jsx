import React from "react";
import SignUp from "../../components/signup";
export default function SignUpPage({ toggleToSignIn }) {
	return (
		<React.Fragment>
			<SignUp toggleToSignIn={toggleToSignIn} />
		</React.Fragment>
	);
}
