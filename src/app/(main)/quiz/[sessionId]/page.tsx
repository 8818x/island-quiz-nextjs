import type { Metadata } from "next";
import ClientQuiz from "./ClientQuiz";

export async function generateMetadata({
	params
}: {
	params: Promise<{ sessionId: string }>;
}) : Promise<Metadata> {
	const { sessionId } = await params;
	return {
		title: `Quiz - Session ${sessionId}`,
		description: "Island Quiz"
	};
}

export default async function QuizPage({
	params
}: {
	params: Promise<{ sessionId: string }>;
}) {
	const { sessionId } = await params;
	return <ClientQuiz sessionId={sessionId} />;
}
