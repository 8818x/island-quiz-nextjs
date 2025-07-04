import type { Metadata } from "next";
import ClientQuiz from "./ClientQuiz";

export async function generateMetadata({
	params
}: {
	params: { sessionId: string };
}): Promise<Metadata> {
	return {
		title: `Island Quiz - Session ${params.sessionId}`,
		description: "Island Quiz"
	};
}

export default function SummaryPage() {
	return <ClientQuiz />;
}
