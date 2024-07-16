import { NextAuthConfig } from "next-auth";
import Google from "@auth/core/providers/google";

export default {
  providers: [ Google ],
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    }
  }
} satisfies NextAuthConfig;