import ClientSummary from "./ClientSummary";

export async function generateMetadata({
	params
}: {
	params: Promise<{ sessionId: string }>;
}) {
	const { sessionId } = await params;
	return {
		title: `Quiz Summary - Session ${sessionId}`,
		description: "Summary of your quiz session"
	};
}

export default async function SummaryPage({
	params
}: {
	params: Promise<{ sessionId: string }>;
}) {
	const { sessionId } = await params;
	return <ClientSummary sessionId={sessionId} />;
}
