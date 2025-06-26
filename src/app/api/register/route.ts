import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, username, displayname } = body;

        if (!email || !password || !username || !displayname) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!strongPasswordRegex.test(password)) {
            return NextResponse.json({ error: "Password must be at least 8 characters long and contain at least one letter and one number" }, { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Username or email already in use" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                displayname,
            },
        });

        return NextResponse.json({ message: "User created", userId: newUser.id }, { status: 201 });
    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
