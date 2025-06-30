import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

    const json = await res.json();
    const { submittedQuestions, score, timeSpent } = json.data;

    const userId = await getCurrentUser(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exists = await prisma.completedSession.findUnique({
        where: {
            sessionId
        }
    })

    if (!exists) {
        try {
            await prisma.completedSession.create({
                data: {
                    sessionId,
                    submittedQuestions,
                    score,
                    timeSpent,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                },
            });
        } catch {
            return NextResponse.json({ error: "Failed to create completed session" }, { status: 500 });
        }
    }

    return NextResponse.json({ submittedQuestions, score, timeSpent }, { status: 200 });
}