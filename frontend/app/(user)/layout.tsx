import React from 'react'
import NavBarComponent from "@/app/Components/Navbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBarComponent/>
      {children}
    </div>
  )
}