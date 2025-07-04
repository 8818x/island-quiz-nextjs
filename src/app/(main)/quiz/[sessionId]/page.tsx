import ClientQuiz from "./ClientQuiz";

export async function generateMetadata({ params }: { params: { sessionId: string } }) {
	return {
		title: `Quiz - Session ${params.sessionId}`,
		description: "Island Quiz"
	};
}

export default function QuizPage({ params }: { params: { sessionId: string } }) {
	return <ClientQuiz sessionId={params.sessionId} />;
}