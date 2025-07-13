"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  id: string;
  role: 'User' | 'LLM' | 'bot';
  content: string;
  chatId: string;
  createdAt: string;
}
interface Chat {
  id: string;
  name: string;
  createdAt: string;
}
interface MessageContextType {
  currentchatid: string | null;
  messages: Message[];
  loading: boolean;
  streamingMessage: string;
  setcurrentchatid: (id: string | null) => void;
  setmessages: (messages: Message[]) => void;
  setloading: (loading: boolean) => void;
  setstreamingmessage: (message: string) => void;
  chats:Chat[]
  setchats:(chats:Chat[])=>void
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [currentchatid, setcurrentchatid] = useState<string | null>(null);
  const [messages, setmessages] = useState<Message[]>([]);
  const [loading, setloading] = useState(false);
  const [streamingMessage, setstreamingmessage] = useState("");
  const [chats, setchats] = useState<Chat[]>([]);

  return (
    <MessageContext.Provider value={{
      currentchatid,
      messages,
      loading,
      streamingMessage,
      setcurrentchatid,
      setmessages,
      setloading,
      setstreamingmessage,
      chats,
      setchats
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}