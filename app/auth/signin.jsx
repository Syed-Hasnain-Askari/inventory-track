"use client";
import React from "react";
import SignIn from "../../components/signin";
import { getSession, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
export default function SignInPage({ toggleToSignUp }) {
	const session = getSession();

	return (
		<React.Fragment>
			<SignIn toggleToSignUp={toggleToSignUp} />
		</React.Fragment>
	);
}
