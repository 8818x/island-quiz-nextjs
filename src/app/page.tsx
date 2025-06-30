"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (status === "loading") return;
		if (!session) {
			router.push("/login");
		}
	}, [session, status, router]);

	async function handleStart() {
		setLoading(true);
		const res = await fetch("/api/quiz/sessions", { method: "POST" });
		setLoading(false);
		if (!res.ok) {
			const data = await res.json();
			toast.error(data.error);
			return;
		}
		const data = await res.json();

		router.push(`/quiz/${data.sessionId}`);
	}
	return (
		<div className="flex flex-col items-start justify-start min-h-screen p-10">
			<h1 className="text-xl font-bold mb-10">QUIZ ISLAND</h1>
			<div className="flex flex-col items-center justify-center flex-1 w-full">
				<button
					className="border px-12 py-3 w-48 cursor-pointer"
					disabled={loading}
					onClick={handleStart}
				>
					{loading ? (
						<div className="flex items-center justify-center gap-2">
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							STARTING...
						</div>
					) : (
						"START"
					)}
				</button>
			</div>
		</div>
	);
}
