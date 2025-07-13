import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useMessage } from "@/context/MessageContext"
import { useEffect, useState } from "react"

export function AppSidebar({className}:{className?:string}) { 
  const {setchats,chats,currentchatid} = useMessage()
  const [loading,setloading] = useState<boolean>(false);
  const router = useRouter()
  async function create(){
    setloading(true)
    const response  = await fetch("/api/chat",{
      method:"POST"
    })
    const data = await response.json()
    console.log(data.message.id)
    const chatid = data.message.id
    router.push(`/chat/${chatid}`)
    setloading(false)
  }
  async function getchats(){
    const response = await fetch("/api/chat", {
      method: "GET"
    })
    const data = await response.json()
    console.log(data.chats)
    setchats(data.chats)
    
  }
  useEffect(()=>{
      getchats();
    },[currentchatid])

  return (
    <Sidebar  variant="floating"  className={className}>
      <SidebarHeader className="w-full flex items-end justify-end px-6" >
        <div>T4.Chat</div>
      </SidebarHeader>
      <SidebarContent>
        <div className={`w-1/2 mt-4 mx-auto border-b border-border/40`}><Button onClick={()=>create()} disabled={loading} className={`cursor-pointer ${loading? "cursor-not-allowed":""}`} variant={"default"}>+ New Chat</Button></div>
        <SidebarGroup />
        <div style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgb(156 163 175) transparent'
                    }} className="w-full px-4 flex flex-col h-4/5 bg--900 overflow-y-scroll gap-1  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300
                        dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400
                        dark:hover:scrollbar-thumb-gray-500
                        scrollbar-thumb-rounded-full scrollbar-track-rounded-full
                        scroll-smooth">
          {chats.map((itm,index)=>{
            return <div onClick={()=>router.push(`/chat/${itm.id}`)}  className="bg- px-2 py-1 rounded-md cursor-pointer hover:bg-secondary">
              {itm.name}
            </div>
          })}
        </div>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter >
        
      </SidebarFooter>
    </Sidebar>
  )
}