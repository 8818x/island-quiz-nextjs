import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
        return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const res = await fetch(
        `${process.env.QUIZ_API_BASE_URL}/Quiz/Questions/${sessionId}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data.data, { status: 200 });
}