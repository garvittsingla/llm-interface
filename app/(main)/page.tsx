"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const {data:session} = useSession()
  return(
    <div className="bg-primaryforeground min-h-screen ">
      {session ? <div>{session.user?.email} <Button onClick={()=>signOut()}>logout</Button></div>: <Button className="text-white" onClick={()=>signIn('google')}>Sign In</Button>}
      <Button variant="destructive" className="">hey hello</Button>
    </div>
  )
}
