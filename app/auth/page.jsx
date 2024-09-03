"use client";
import React, { useState } from "react";

import AuthFormWrapper from "./layout";
import SignInPage from "./signin";
import SignUpPage from "./signup";
export default function AuthPage() {
	const [isSignIn, setIsSignIn] = useState(true);
	return (
		<AuthFormWrapper>
			{isSignIn ? (
				<SignInPage toggleToSignUp={() => setIsSignIn(false)} />
			) : (
				<SignUpPage toggleToSignIn={() => setIsSignIn(true)} />
			)}
		</AuthFormWrapper>
	);
}
