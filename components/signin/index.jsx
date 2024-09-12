"use client";
import { getSession, signIn } from "next-auth/react";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useToast } from "../../components//ui/use-toast";
export default function SignIn({ csrfToken, toggleToSignUp }) {
	const { pending } = useFormStatus();
	const { toast } = useToast();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await signIn("credentials", {
			redirect: true,
			email,
			password,
			callbackUrl: "/dashboard"
		});
		if (result.error) {
			toast({
				title: "Ops!",
				description: result.error
			}); // Handle login errors
		} else {
			// Ensure the session is updated on the client-side
			const session = await getSession();
			if (session) {
				router.refresh(); // Redirect to dashboard if session exists
			} else {
				toast({
					title: "Session Error",
					description: "Failed to retrieve session. Please try again."
				});
			}
		}
	};
	return (
		<React.Fragment>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Your Company"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
						className="mx-auto h-10 w-auto"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Sign In to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Password
								</label>
								<div className="text-sm">
									<a
										href="#"
										className="font-semibold text-indigo-600 hover:text-indigo-500"
									>
										Forgot password?
									</a>
								</div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									onChange={(e) => {
										setPassword(e.target.value);
									}}
									required
									autoComplete="current-password"
									className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<button
								disabled={pending}
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								{pending ? "loaging..." : "Sign In"}
							</button>
						</div>
					</form>
					<p className="mt-10 text-center text-sm text-gray-500">
						Don't have an account?{" "}
						<button
							onClick={toggleToSignUp}
							className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
						>
							Sign Up
						</button>
					</p>
				</div>
			</div>
		</React.Fragment>
	);
}