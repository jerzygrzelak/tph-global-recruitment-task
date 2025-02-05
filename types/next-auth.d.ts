import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            token: string;
            email: string;
            name: string;
        };
    }
    interface User {
        id: string;
        token: string;
        email: string;
        name: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
            id: string;
            token: string;
            name: string;
            email: string;
    }
}