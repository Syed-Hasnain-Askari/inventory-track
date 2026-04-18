"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../app/lib/actions/logoutAction";

const AUTO_LOGOUT_AFTER_MS = 10 * 1000;

export default function SessionAutoLogout({ isAuthenticated }) {
	const router = useRouter();
	const hasLoggedOut = useRef(false);

	useEffect(() => {
		if (!isAuthenticated) {
			return undefined;
		}

		hasLoggedOut.current = false;

		const timeoutId = setTimeout(async () => {
			if (hasLoggedOut.current) {
				return;
			}

			hasLoggedOut.current = true;

			try {
				await logout();
			} catch (error) {
				console.error("Automatic logout failed:", error);
				router.replace("/login");
				router.refresh();
			}
		}, AUTO_LOGOUT_AFTER_MS);

		return () => clearTimeout(timeoutId);
	}, [isAuthenticated, router]);

	return null;
}
