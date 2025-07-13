"use client";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Textinput } from "./Textinput";
import { useEffect, useState, useRef } from "react";
import { useMessage } from "@/context/MessageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tailspin } from 'ldrs/react'
import 'ldrs/react/Tailspin.css'

function UserMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex justify-end mb-4"
    >
      <div className="flex items-start gap-3 max-w-[70%]">
        <div className="bg-primary text-primary-foreground rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 rounded-full p-2 flex-shrink-0 hover:bg-primary/20 transition-colors"
        >
          <User className="h-4 w-4 text-primary" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function BotMessage({
  message,
  isStreaming = false,
}: {
  message: string;
  isStreaming?: boolean;
}) {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3 max-w-[70%]">
        <div className="bg-muted rounded-full p-2 flex-shrink-0">
          <Bot className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="bg-background border border-border rounded-xl px-4 py-3 shadow-sm">
          <p className="text-sm text-foreground">
            {message}
            {isStreaming && <span className="animate-pulse ml-1">▋</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3 max-w-[70%]">
        <div className="bg-muted rounded-full p-2 flex-shrink-0">
          <Bot className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="bg-background border border-border rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const {
    currentchatid,
    messages,
    setmessages,
    loading,
    setloading,
    streamingMessage,
    setstreamingmessage,
  } = useMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialloader,setinitialloader] = useState<boolean>(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function loadMessages() {
    setinitialloader(true)
    if (!currentchatid) return;
    try {
      const response = await fetch(`/api/message/${currentchatid}`);
      const data = await response.json();
      console.log(data.messages);
      setmessages(data.messages || []);
      setinitialloader(false)
    } catch (error) {
      console.error("Error loading messages:", error);
      setinitialloader(false)
    }
  }

  async function sendMessage(message: string) {
    if (!message.trim() || !currentchatid) return;

    setloading(true);
    setstreamingmessage("");

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "User" as const,
      content: message,
      chatId: currentchatid,
      createdAt: new Date().toISOString(),
    };

    setmessages([...messages, userMessage]);

    try {
      const response = await fetch(`/api/message/${currentchatid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      let aiResponse = "";
      const aiMessageId = `bot-${Date.now()}`;

      const aiMessage = {
        id: aiMessageId,
        role: "bot",
        content: "",
        chatId: currentchatid,
        createdAt: new Date().toISOString(),
      };

      setmessages((prev) => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        aiResponse += chunk;
        setstreamingmessage(aiResponse);

        setmessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: aiResponse } : msg
          )
        );
      }

      setstreamingmessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setmessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [currentchatid]);

    if(initialloader === true){
        return  <div className="bg-black h-screen w-full flex items-center justify-center">
          <Tailspin
                size="40"
                stroke="5"
                speed="0.9"
                color="white" 
                />
        </div>
        }
  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 overflow-y-auto
                        scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300
                        dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400
                        dark:hover:scrollbar-thumb-gray-500
                        scrollbar-thumb-rounded-full scrollbar-track-rounded-full
                        scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgb(156 163 175) transparent",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-6 min-h-full">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) =>
                message.role === "User" ? (
                  <UserMessage
                    key={message.id || index}
                    message={message.content}
                  />
                ) : (
                  <BotMessage
                    key={message.id || index}
                    message={message.content}
                    isStreaming={
                      streamingMessage.length > 0 &&
                      message.content === streamingMessage
                    }
                  />
                )
              )
            )}

            {loading && <LoadingMessage />}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="bg-background border px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Textinput sendmessage={sendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
