"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		setLoading(true);
		await signOut({ callbackUrl: "/login" });
	};

	return (
		<div>
			<button
				type="button"
				onClick={handleLogout}
				disabled={loading}
				className={`w-full py-2 px-4 rounded font-semibold text-white transition duration-300 ease-in-out flex items-center justify-center gap-2 cursor-pointer ${
					loading
						? "bg-red-400 cursor-not-allowed"
						: "bg-red-600 hover:bg-red-700"
				}`}
			>
				{loading ? (
					<>
						<span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						Signing out...
					</>
				) : (
					"Sign out"
				)}
			</button>
		</div>
	);
}
