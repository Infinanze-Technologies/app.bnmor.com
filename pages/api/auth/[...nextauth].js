import { PAGE_LOGIN} from "@/config/page-routes";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authServices from "src/services/auth.services";
import { URL_LOGIN } from "@/config/api-paths";

export const authOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      id: 'local',
      async authorize(credentials, req) {
        let data = {
          email: credentials?.email,
          password: credentials.password
        }

        // console.log(data)

        return authServices
          .requestLOGIN(URL_LOGIN,data)
          .then(res => {
            console.log(res)
            return {
              ...res.data?.data
            }
          })
          .catch(err => {
            // console.log("err.response?.data",err.response?.data)
            console.log('process.env.NEXT_PUBLIC_API_URL',process.env.NEXT_PUBLIC_API_URL)
            if (!err.response || err.code == 'ECONNREFUSED') {
              return Promise.reject(new Error('Connection Refused , check your network.'))
            }
            let errMsg = err.response?.data?.message ?? err.response?.data?.error
            return Promise.reject(new Error(errMsg))
          })
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "PvabK+YmBWsE1nehEPmD8hL/tmpa1/n9bwNewmXyfAo=",
  pages: {
    signIn: PAGE_LOGIN
  },
  callbacks: {
    async signIn({ user, email, credentials }) {
      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (account?.provider == 'local') {
        token.user = {...user}
        token.jwt = user?.tokens?.access_token 
      }
      return token;
    },
    async session({ session, token, user }) {
      session.jwt = token?.jwt
      session.user = token?.user
      return session
    },
  },
};

export default NextAuth(authOptions);
