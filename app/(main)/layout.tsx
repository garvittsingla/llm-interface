"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {

     useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])
    
    const {data:session} = useSession()
    if(session?.user.email){
         return (
    <div className="min-h-screen w-full relative bg-secondary">
     <AppSidebar className="absolute z-10 inset-0 bg-secondary-background"/>
     <main className="relative w-full min-w-full">
         <SidebarTrigger 
         className="absolute top-4 left-4 z-[999] p-2 rounded-lg
          text-white bg-gray-800/50 backdrop-blur-sm
          border border-gray-700/50
          hover:bg-gray-700/50 transition-colors
          focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-none"
         aria-label="Toggle sidebar"
         />
         {children}
     </main>
     </div>
  )
    }else{
        return <>
            {children}
        </>
    }
   
}