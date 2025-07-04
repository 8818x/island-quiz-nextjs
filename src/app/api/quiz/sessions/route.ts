import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

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

export async function DELETE(req: NextRequest) {
    const userId = await getCurrentUser(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { currentSessionId: null },
        });
    } catch {
        return NextResponse.json({ error: "Failed to delete current session" }, { status: 500 });
    }

    return NextResponse.json({ sessionId: null, message: "Current session deleted" }, { status: 200 });
}