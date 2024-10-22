// pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions, Awaitable } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<any> {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email }
                });

                if (user && credentials?.password) {
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

                    if (isValidPassword) {
                        return user;
                    }
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
