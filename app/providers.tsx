"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MessageProvider } from "@/context/MessageContext";
import {SessionProvider } from "next-auth/react"
import { RecoilRoot } from "recoil";
export default function Provider({children}:{children:React.ReactNode}){
    return <SessionProvider >
        <MessageProvider>
             <SidebarProvider>
            {children}
            
            </SidebarProvider>
        </MessageProvider>
    </SessionProvider>
}