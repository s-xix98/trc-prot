import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FortyTwoProvider from 'next-auth/providers/42-school';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
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
      async authorize(credentials) {
        // backendにリクエストを送る
        if (!credentials) {
          return null;
        }

        const response = await axios.post(
          'http://backend:8000' + '/auth/authLogin',
          {
            email: credentials.email,
            hashedPassword: credentials.password,
          },
        );

        if (response.status !== 200) {
          return null;
        }

        return response.data;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log(user);
      console.log(account);

      if (!user || !account) {
        return false;
      }

      const provider = account.provider;
      let accessToken;
      let response;
      //  TODO リクエストの引数にid, provider, emailを追加する
      if (provider === 'google' || provider === '42-school') {
        response = await axios.post(
          'http://backend:8000' + '/auth/providerLogin',
        );
        if (response.status !== 200) {
          return false;
        }
        accessToken = response.data.jwt;
      } else if (provider === 'credentials') {
        accessToken = user.accessToken;
      } else {
        return false;
      }

      user.accessToken = accessToken;
      return true;
    },
    // 下のsession関数を使うと呼ばれる
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }

      return token;
    },
    // getSession関数を使うと呼ばれる
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
