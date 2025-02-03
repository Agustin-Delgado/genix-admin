import Header from "@/components/header"
import Navbar from "@/components/navbar"
import React from "react"

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      {/*       <Navbar />
 */}      <div className="p-6 max-w-7xl mx-auto flex flex-col w-full h-full">
        {children}
      </div>
    </div>
  )
}

