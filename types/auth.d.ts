import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    idToken?: string;
    backendToken?: string | null;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    idToken?: string;
    backendToken?: string | null;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
