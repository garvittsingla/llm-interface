import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: any }) {
  const session = await getServerSession(authOptions);
  const { chatid } = params;
  const userid = session?.user?.userId;

  if (!chatid) {
    return NextResponse.json({ error: "chat id not found" }, { status: 400 });
  }

    

  try {

    const {prompt} = await request.json()

    const newmessage = await prisma.message.create({
        data:{
            chatId:chatid,
            role:"User",
            content:prompt
        }
    })

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const chat = ai.chats.create({ model: "gemini-2.0-flash" });

    const response = await chat.sendMessageStream({
      message: "Why is orange green",
    });

    const encoder = new TextEncoder();
    let final = ""
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(encoder.encode(chunk.text));
          final += chunk.text
        }
        controller.close();
      },
    });
     const message= await prisma.message.create({
        data:{
            chatId:chatid,
            role:"LLM",
            content:final
        }
    })

    console.log(final)
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Stream error:", error);
    return NextResponse.json({ error: "Streaming failed" }, { status: 500 });
  }
}

export async function GET({params}:{params:any}){
    const session = getServerSession(authOptions);
    const {chatid} = params
    try {
        const messages = await prisma.message.findMany({
            where:{
                chatId:chatid
            },orderBy:{
                createdAt:'asc'
            }
        })

        return NextResponse.json({
            messages
        })
    } catch (error) {
        return NextResponse.json({
            error:"Some error found"
        })
    }
}