"use client";

import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";

export default function Navbar() {
	const { data: session } = useSession();
	const displayname = session?.user?.displayname;
	const username = session?.user?.username;
	return (
		<nav className="w-full flex items-center justify-between px-8 py-4 shadow-md">
			<span className="text-xl font-bold tracking-wide text-gray-800 select-none">
				QUIZ ISLAND
			</span>
			<div className="flex items-center gap-4">
				{displayname && username && (
					<div className="text-right mr-2">
						<div className="font-medium">{displayname}</div>
						<div className="text-xs text-gray-500">
                            @{username}</div>
					</div>
				)}
				<LogoutButton />
			</div>
		</nav>
	);
}
