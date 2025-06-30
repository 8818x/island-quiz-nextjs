"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import CircularScore from "@/components/CircularScore";

type Summary = {
	submittedQuestions: number;
	score: number;
	timeSpent: number;
};
export default function SummaryPage() {
	const { sessionId } = useParams() as { sessionId: string };
	const [summary, setSummary] = useState<Summary | null>(null);

	const router = useRouter();

	const fetchRef = useRef(false);

	useEffect(() => {
		if (fetchRef.current) return;
		fetchRef.current = true;

		if (!sessionId) {
			toast.error("Session not found. Redirecting to home...");
			router.push("/");
			return;
		}

		fetch(`/api/quiz/summary?sessionId=${sessionId}`)
			.then((res) => {
				if (!res.ok) throw new Error("Fetch failed");
				return res.json();
			})
			.then((data: Summary) => {
				setSummary(data);
			})
			.catch(() => {
				toast.error("Failed to fetch summary");
			});
	}, [sessionId, router]);

	if (!summary) {
		return (
			<div className="h-[75dvh] overflow-hidden flex items-center justify-center bg-white">
				<div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
				<span className="ml-3">Loading...</span>
			</div>
		);
	}

	const handleContinue = async () => {
		await fetch(`/api/quiz/sessions`, { method: "DELETE" });
		router.push("/");
	}
	return (
		<div className="flex flex-col items-start justify-start h-[75dvh] overflow-hidden">
			<div className="flex flex-col items-center justify-center flex-1 w-full">
				<h1 className="text-2xl font-bold mb-4">Quiz Ending</h1>
				<span className="mb-4">Score is</span>
				<div className="flex items-center justify-center mb-4">
					<CircularScore score={summary.score} />
				</div>
				<span className="mb-4">Time Spent : {summary.timeSpent} seconds</span>

				<button
					className="w-32 px-4 py-2 cursor-pointer border border-black hover:bg-gray-100 transition duration-300 ease-in-out"
					onClick={handleContinue}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
