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
                // Find the user by email in the database
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email }
                });
                console.log(user);
                // If the user exists and provided a password
                if (user && credentials?.password) {
                    // Compare the provided password with the hashed password in the database
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

                    // If the password is valid, return the user object
                    if (isValidPassword) {
                        return user;
                    }
                }
                // Return null if the authentication failed
                return null;
            }
        })
    ],
    pages: {
        signIn: '/auth/login', // Custom sign-in page if needed
    },
    session: {
        strategy: "jwt", // Use JWT for session management
    },
    callbacks: {
        async jwt({ token, user }) {
            // Attach user info to the JWT token
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

// export { handler as GET, handler as POST, authOptions }