"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User, Bot } from "lucide-react";
import { Textinput } from "./Textinput";
import { useState } from "react";

function UserMessage({ message }:{message:string}) {
    return (
        <div className="flex justify-end mb-4">
            <div className="flex items-start gap-3 max-w-[70%]">
                <div className="bg-primary text-primary-foreground rounded-xl px-4 py-3 shadow-sm">
                    <p className="text-sm">{message}</p>
                </div>
                <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                </div>
            </div>
        </div>

    );
}

function BotMessage({ message }:{message:string}) {
    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start gap-3 max-w-[70%]">
                <div className="bg-muted rounded-full p-2 flex-shrink-0">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="bg-background border border-border rounded-xl px-4 py-3 shadow-sm">
                    <p className="text-sm text-foreground">{message}</p>
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    const [messages,setmessages] = useState([])
    const [message,setmessage] = useState("")
    console.log(message)

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-xl font-semibold text-foreground">Chat Assistant</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    {messages.map((message, index) => (
                        message.type === 'user' ? (
                            <UserMessage key={index} message={message.content} />
                        ) : (
                            <BotMessage key={index} message={message.content} />
                        )
                    ))}
                </div>
            </div>

            <div className="bg-background border-t border-border px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto flex justify-center">
                    <Textinput usermessage = {setmessage}/>
                </div>
            </div>
        </div>
    );
}