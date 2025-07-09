"use client";
import ChatPage from '@/components/ui/ChatPage'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Textinput } from '@/components/ui/Textinput'
import React from 'react'

const page = ({params}:{params:any}) => {
  const {chatid} = params
  console.log(chatid)
  return (
    <div className='bg-primaryforeground h-screen w-full flex p-9 text-white  flex-col justify-center'>
      <ChatPage/>
   
    </div>
  )
}

export default page