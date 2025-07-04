import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, questionId, choiceId, timeSpent } = body;

        if (!sessionId || !questionId || !choiceId || timeSpent === undefined ||
            timeSpent === null) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const answerResponse = await fetch(`${process.env.QUIZ_API_BASE_URL}/Quiz/Answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, questionId, choiceId, timeSpent }),
        });

        if (!answerResponse.ok) {
            return NextResponse.json({ error: "Failed to answer question" }, { status: 500 });
        }
        const answerResult = await answerResponse.json();
        const isCorrect = answerResult.data.isCorrect;

        return NextResponse.json({ isCorrect }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to answer question" }, { status: 500 });
    }
}