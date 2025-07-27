import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(){
    const session =await getServerSession(authOptions)
    
    const userid = session?.user.userId;
    if(!userid){
        return
    }
    const newchat = await prisma.chat.create({
        data:{
            userId:userid

        }
    })
    return NextResponse.json({
        message:newchat
    })
    
}
export async function GET(req:NextRequest){
    const session =await getServerSession(authOptions)

   const userid = session?.user.userId

const chats = await prisma.chat.findMany({
      where: {
            userId: userid
      },
      select: {
            id: true,
            name:true,
            
      },orderBy:{
        createdAt:'desc'
      }
 })
 
 
 return NextResponse.json({
      chats: chats
 })
}

