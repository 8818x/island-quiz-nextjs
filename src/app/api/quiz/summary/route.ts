import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
        return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const res = await fetch(
        `${process.env.QUIZ_API_BASE_URL}/Quiz/Summary/${sessionId}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
    }

    const data = await res.json();
    await prisma.completedSession.create({
        data: {
            sessionId,
            submittedQuestions: data.submittedQuestions,
            score: data.score,
            timeSpent: data.timeSpent,
            user: {
                connect: {
                    id: data.userId
                }
            }
        },
    });

    return NextResponse.json(data, { status: 200 });
    }