import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ chatid: string }> }) {
  const session = await getServerSession(authOptions);
  const { chatid } = await params;
  const userid = session?.user?.userId;

  if (!userid) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!chatid) {
    return NextResponse.json({ error: "Chat ID not found" }, { status: 400 });
  }

  try {
    const { prompt } = await request.json();

    const firstFourWords = prompt.split(' ').slice(0, 4).join(' ');
    
    await prisma.chat.update({
        where: {
        id: chatid
        },
        data: {
        name: firstFourWords
      }
    });
    await prisma.message.create({
      data: {
        chatId: chatid,
        role: "User",
        content: prompt
      }
    });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const chat = ai.chats.create({ model: "gemini-2.0-flash" });
    const response = await chat.sendMessageStream({ message: prompt });

    const encoder = new TextEncoder();
    let final = "";
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            controller.enqueue(encoder.encode(chunk.text));
            final += chunk.text;
          }
          
         
          await prisma.message.create({
            data: {
              chatId: chatid,
              role: "LLM",
              content: final
            }
          });
          
          console.log("AI response saved:", final);
        } catch (error) {
          console.error("Streaming error:", error);
        } finally {
          controller.close();
        }
      },
    });

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ chatid: string }> }) {
  const session = await getServerSession(authOptions);
  const { chatid } = await params;

  if (!session?.user?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatid
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ chatid: string }> }) {
  const session = await getServerSession(authOptions);
  const { chatid } = await params;

  if (!session?.user?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  console.log("req came")
  try {
    const deletedChat = await prisma.chat.delete({
      where: {
        id: chatid
      }
    });
    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete chat error:", error);
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}