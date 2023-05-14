import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FortyTwoProvider from "next-auth/providers/42-school";
import CredentialsProvider from "next-auth/providers/credentials";
const handler = NextAuth({ providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  }),
  FortyTwoProvider({
    clientId: process.env.FORTY_TWO_CLIENT_ID || "",
    clientSecret: process.env.FORTY_TWO_CLIENT_SECRET || "",
  }),
  CredentialsProvider({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email", placeholder:"exaple@example.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // backendにリクエストを送る
      const user = { id: "1", name: "hoge", email: "exaple@example.com" }
      if (user) {
        return user
      }
      return null
    }
  })
  ],
  callbacks: {
    async signIn({user, account, profile, email, credentials}) {
      console.log(user);
      console.log(account);
      console.log(profile);
      console.log(email);
      console.log(credentials);
      return true;
    },
  },
});

export { handler as GET, handler as POST }