import prisma from "@/lib/prisma";
import NextAuth, { AuthOptions, Session, TokenSet, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions:AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret:"dskajbdsakjbdjsabd",
  callbacks: {
    async signIn({user,account,profile}){
        if(account?.provider==="google"){
            try {
                const exisitngUser = await prisma.user.findUnique({
                    where:{email:user.email!}
                })
                if (!exisitngUser){
                    const newuser = await prisma.user.create({
                        data:{
                            email:user.email!
                        }
                    })
                }
                return true;
            } catch (error) {
                return false;
            }
        }
        return true
    },
    async jwt({ token, user }:{token:any,user:any}) {
      if (user) {
        const existinguser = await prisma.user.findUnique({
          where:{email:user.email}
        })
        if(existinguser){
          token.email = user.email;
          token.userId = existinguser.id;

        }
      }
      
      return token;
    },
    async session({ session, token }:{session:any,token:any}) {
      session.user.email = token.email;
      session.user.userId = token.userId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
