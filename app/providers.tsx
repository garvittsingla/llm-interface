"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import {SessionProvider } from "next-auth/react"
import { RecoilRoot } from "recoil";
export default function Provider({children}:{children:React.ReactNode}){
    return <SessionProvider >
        <RecoilRoot>
             <SidebarProvider>
            {children}
            
            </SidebarProvider>
        </RecoilRoot>
    </SessionProvider>
}