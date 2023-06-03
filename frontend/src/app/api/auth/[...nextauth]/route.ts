import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FortyTwoProvider from 'next-auth/providers/42-school';
import CredentialsProvider from 'next-auth/providers/credentials';
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FortyTwoProvider({
      clientId: process.env.FORTY_TWO_CLIENT_ID || '',
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // backendにリクエストを送る
        console.log(credentials);
        console.log(req);
        const user = { id: '1', name: 'hoge', email: 'example@example.com' };
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],

  // jwtでsessionを管理する場合設定する
  session: {strategy: 'jwt'},

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user);
      console.log(account);
      console.log(profile);
      console.log(email);
      console.log(credentials);
      user.accessToken = 'mock access token';
      return true;
    },

    async jwt({ token, user }) {
      console.log('next-auth --jwt--');
      console.log(user?.accessToken);
      console.log(token?.accessToken);

      if (user?.accessToken){
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      console.log('next-auth --session--');
      console.log(token?.accessToken);

      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
