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
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <h1 className="text-primary text-xl font-bold sm:text-2xl lg:text-3xl">Hoster</h1>
        </div>
        <div className="flex items-center gap-2">
          {showExitButton ? (
            <Button
              variant="outline"
              onClick={handleExit}
              className="flex items-center gap-2"
            >
              <DoorOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
