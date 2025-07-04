"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Choice {
	choiceId: string;
	title: string;
}

interface Question {
	questionId: string;
	title: string;
	choices: Choice[];
}

export default function ClientQuiz({ sessionId }: { sessionId: string }) {
	const [question, setQuestion] = useState<Question | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [isCorrectResult, setIsCorrectResult] = useState<boolean | null>(null);
	const [nextLoading, setNextLoading] = useState(false);

	const router = useRouter();

	const [elapsed, setElapsed] = useState(0);
	const startTimeRef = useRef<number | null>(null);

	const fetchQuestion = useCallback(async () => {
		if (!sessionId) {
			toast.error("Session not found. Redirecting to home...");
			router.push("/");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch(`/api/quiz/questions?sessionId=${sessionId}`);
			if (!res.ok) throw new Error();

			const data = await res.json();

			if (!data?.questionId) {
				router.push(`/summary/${sessionId}`);
				return;
			}

			setQuestion(data);
		} catch {
			toast.error("Failed to fetch question. Redirecting to home...");
			router.push("/");
		} finally {
			setLoading(false);
		}
	}, [sessionId, router]);

	const initialFetchRef = useRef(false);
	useEffect(() => {
		if (!initialFetchRef.current) {
			initialFetchRef.current = true;
			fetchQuestion();
		}
	}, [fetchQuestion]);

	useEffect(() => {
		if (!question || !sessionId) return;

		const startKey = `quiz_start_${sessionId}_${question.questionId}`;
		const saved = localStorage.getItem(startKey);

		let now: number;
		if (saved) now = Number(saved);
		else {
			now = Date.now();
			localStorage.setItem(startKey, String(now));
		}
		startTimeRef.current = now;

		setElapsed(0);

		const interval = setInterval(() => {
			if (startTimeRef.current) {
				setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
			}
		}, 500);

		return () => clearInterval(interval);
	}, [question, sessionId]);

	async function handleAnswer(choiceId: string) {
		if (!question) return;
		setSubmitting(true);

		const startKey = `quiz_start_${sessionId}_${question.questionId}`;
		const timeSpent = startTimeRef.current
			? Math.floor((Date.now() - startTimeRef.current) / 1000)
			: 0;

		try {
			const res = await fetch("/api/quiz/answer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					sessionId,
					questionId: question.questionId,
					choiceId,
					timeSpent
				})
			});
			localStorage.removeItem(startKey);
			if (!res.ok) throw new Error();
			const { isCorrect } = await res.json();
			setIsCorrectResult(isCorrect);
			setShowModal(true);
		} catch {
			toast.error("Failed to answer question");
		} finally {
			setSubmitting(false);
		}
	}

	const handleNext = async () => {
		setNextLoading(true);
		try {
			await fetchQuestion();
		} finally {
			setNextLoading(false);
			setShowModal(false);
		}
	};
	if (loading) {
		return (
			<div className="h-[75dvh] flex items-center justify-center bg-white">
				<div className="w-12 h-12 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
				<span className="ml-3">Loading...</span>
			</div>
		);
	}

	if (!question) {
		return (
			<div className="h-[75dvh] flex items-center justify-center bg-white">
				<div className="p-10 text-red-600">Question not found</div>
			</div>
		);
	}

	return (
		<div className="relative flex flex-col items-start justify-start h-[75dvh] p-10">
			<div className="absolute right-8 top-3 px-4">
				<h3>Time: {elapsed}s</h3>
			</div>
			<div className="flex flex-col items-center justify-center flex-1 w-full">
				{loading || !question ? (
					<div className="text-gray-500">Loading...</div>
				) : (
					<div className="w-full max-w-md p-6">
						<p className="mb-4 font-medium">{question.title}</p>
						<ul className="flex flex-col gap-3">
							{question.choices.map((c) => (
								<li
									key={c.choiceId}
									onClick={() => !submitting && handleAnswer(c.choiceId)}
									className="border px-4 py-2 hover:bg-gray-100 cursor-pointer text-center"
								>
									{c.title}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black/10 flex items-center justify-center">
					<div className="bg-white p-6 shadow-lg text-center w-80">
						<p className="mb-2 text-sm uppercase text-gray-500">
							Your Answer is
						</p>
						<p
							className={`text-3xl font-bold mb-4 ${
								isCorrectResult ? "text-green-600" : "text-red-600"
							}`}
						>
							{isCorrectResult ? "Correct" : "Incorrect"}
						</p>
						<button
							onClick={handleNext}
							disabled={nextLoading}
							className="w-full px-4 py-2 cursor-pointer border border-black text-black hover:bg-gray-100 disabled:opacity-50 transition duration-300 ease-in-out"
						>
							{nextLoading ? "Loading..." : "NEXT"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
