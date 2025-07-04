import ClientSummary from "./ClientSummary";

export async function generateMetadata({ params }: { params: { sessionId: string } }) {
	return {
		title: `Quiz Summary - Session ${params.sessionId}`,
		description: "Summary of your quiz session"
	};
}

export default function SummaryPage() {
	return <ClientSummary />;
}