"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function Header() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl text-primary font-bold">Hoster</h1>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
