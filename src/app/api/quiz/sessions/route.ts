import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.currentSessionId) {
        return NextResponse.json({ sessionId: user.currentSessionId }, { status: 200 });
    }

    const res = await fetch(
        `${process.env.QUIZ_API_BASE_URL}/Quiz/Session`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }
    );

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }
    
    const data = await res.json();
    const newSessionId = data.data.sessionId;

    await prisma.user.update({
        where: { id: session.user.id },
        data: { currentSessionId: newSessionId },
    });

    return NextResponse.json({ sessionId: newSessionId }, { status: 200 });
}