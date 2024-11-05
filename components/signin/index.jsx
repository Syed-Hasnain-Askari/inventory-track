"use client";
import React, { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { loginAction } from "../../app/login/action";
export default function SignIn({ toggleToSignUp }) {
	const { toast } = useToast();
	const INITIAL_STATE = {
		data: null
	};
	const [formState, formAction, pending] = React.useActionState(
		loginAction,
		INITIAL_STATE
	);
	useEffect(() => {
		if (formState?.errors?.message) {
			toast({
				title: `Uh oh! ${formState.errors.message}.`
			});
		}
	}, [formState?.errors?.message]);
	console.log(formState);
	return (
		<React.Fragment>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="flex justify-center items-center">
					<Image
						src="/icons/logo.png"
						alt="edstock-logo"
						width={100}
						height={100}
					/>
				</div>
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Sign In to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form action={formAction} method="POST" className="space-y-6">
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
									autoComplete="email"
									className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
								{formState?.errors?.email && (
									<p className="text-sm text-red-500">
										{formState.errors.email}
									</p>
								)}
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
									autoComplete="current-password"
									className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
								{formState?.errors?.password && (
									<p className="text-sm text-red-500">
										{formState.errors.password}
									</p>
								)}
							</div>
						</div>
						<div>
							<button
								type="submit"
								disabled={pending}
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								{pending ? (
									<>
										<svg
											class="mr-3 h-5 w-5 animate-spin text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										<span class="font-medium"> Loading... </span>
									</>
								) : (
									"Login"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</React.Fragment>
	);
}
