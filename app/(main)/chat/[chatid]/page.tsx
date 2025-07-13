"use client";
import ChatPage from '@/components/ui/ChatPage'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Textinput } from '@/components/ui/Textinput'
import { useMessage } from '@/context/MessageContext';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {
  const params = useParams()
  const chatid = params.chatid as string
  const {setcurrentchatid} = useMessage()
  setcurrentchatid(chatid)
  console.log(chatid)

  if(!chatid){
    return <div>Loading...</div>
  }
  return (
    <div className='bg-black h-screen w-full flex p-9 text-white  flex-col justify-center'>
      <ChatPage />
   
    </div>
  )
}

export default page