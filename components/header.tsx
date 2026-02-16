"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DoorOpen, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useStorageStore } from "@/lib/stores/storage-store"

type HeaderProps = {
  showExitButton?: boolean
}

export function Header({ showExitButton = false }: HeaderProps) {
  const router = useRouter()
  const clearSelectedStorage = useStorageStore((state) => state.clearSelectedStorage)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const handleExit = () => {
    clearSelectedStorage()
    router.push("/storage")
  }

  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl text-primary font-bold">Hoster</h1>
        </div>
        <div className="flex items-center gap-2">
          {showExitButton ? (
            <Button
              variant="outline"
              onClick={handleExit}
              className="flex items-center gap-2"
            >
              <DoorOpen className="h-4 w-4" />
              Exit
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
