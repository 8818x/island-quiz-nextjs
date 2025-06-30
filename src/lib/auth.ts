import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {};
                if (!email || !password) throw new Error('Missing credentials');

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) throw new Error('User not found');

                const isPasswordCorrect = await bcrypt.compare(password, user.password);
                if (!isPasswordCorrect) throw new Error('Invalid password');

                return {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayname: user.displayname,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.user) {
                session.user = token.user as {
                    id: string,
                    email: string,
                    username: string,
                    displayname: string
                };
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
