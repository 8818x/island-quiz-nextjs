"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function QuizPage() {
	const { sessionId } = useParams() as { sessionId: string };
	const [question, setQuestion] = useState<Question | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [isCorrectResult, setIsCorrectResult] = useState<boolean | null>(null);
	const [nextLoading, setNextLoading] = useState(false);

	const router = useRouter();

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

			if (!data) {
				router.push("/quiz/summary");
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

	useEffect(() => {
		fetchQuestion();
	}, [fetchQuestion]);

	async function handleAnswer(choiceId: string) {
		if (!question) return;
		setSubmitting(true);
		try {
			const res = await fetch("/api/quiz/answer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					sessionId,
					questionId: question.questionId,
					choiceId,
					timeSpent: 0
				})
			});
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
			<div className="min-h-screen flex items-center justify-center bg-white">
				<div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
				<span className="ml-3">Loading...</span>
			</div>
		);
	}

	if (!question) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<div className="p-10 text-red-600">Question not found</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-start justify-start min-h-screen p-10 bg-gray-50">
			<h1 className="text-xl font-bold mb-10">QUIZ ISLAND</h1>
			<div className="flex flex-col items-center justify-center flex-1 w-full">
				{loading || !question ? (
					<div className="text-gray-500">Loading...</div>
				) : (
					<div className="w-full max-w-md p-6 rounded-lg">
						<p className="mb-4 font-medium">{question.title}</p>
						<ul className="flex flex-col gap-3">
							{question.choices.map((c) => (
								<li
									key={c.choiceId}
									onClick={() => !submitting && handleAnswer(c.choiceId)}
									className="border px-4 py-2 rounded hover:bg-gray-100 cursor-pointer text-center"
								>
									{c.title}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black/10 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
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
							className="w-full px-4 py-2 border border-black text-black rounded hover:bg-gray-100 disabled:opacity-50"
						>
							{nextLoading ? "Loading..." : "NEXT"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
