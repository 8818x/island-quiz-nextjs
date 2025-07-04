'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import * as z from 'zod';

const RegisterSchema = z.object({
    displayname: z.string().min(2, "Name must be at least 2 characters."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Za-z]/, "Password must contain at least one letter.")
        .regex(/\d/, "Password must contain at least one number."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
})

export interface RegisterState {
    error?: string;
    success?: string;
}

export async function registerUser(
    prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const rawformData = Object.fromEntries(formData.entries());
    const validatedFields = RegisterSchema.safeParse(rawformData);

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const errorMessages = Object.values(fieldErrors).flat();
        return { error: errorMessages.join(' ') };
    }
    const { email, password, username, displayname } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ]
            }
        });

        if (existingUser) {
            return { error: "Username or email already in use" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                displayname,
            },
        });

        return { success: "User created successfully" };
    } catch {
        return { error: "Failed to create user" };
    }
}