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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user);
      console.log(account);
      console.log(profile);
      console.log(email);
      console.log(credentials);

      const response = await axios.post('http://backend:8000' + '/auth/providerLogin');
      if (response.status !== 200) {
        return false;
      }
      // userプロパティにアクセストークンを入れるプロパティがないからとりあえずnameに入れた
      // jwt,sessionも同様にnameに入れた
      user.name = response.data.jwt;
      return true;
    },
    // 下のsession関数を使うと呼ばれる
    async jwt({token, user}) {
      if(user){
        token.name = user.name;
      }

      return token;
    },
     // getSession関数を使うと呼ばれる
    async session({session, token}) {
      if(token && session.user){
        session.user.image = token.picture;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
