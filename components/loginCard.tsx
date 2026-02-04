"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import {signIn} from "next-auth/react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export function LoginCard() {
    const [show, setShow] = React.useState(false)

    const router = useRouter()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const email = (form.elements.namedItem("email") as HTMLInputElement).value
        const password = (form.elements.namedItem("passcode") as HTMLInputElement).value

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (!res) {
            toast.error("Unexpected error")
            return
        }

        if (res.error) {
            toast.error("Invalid email or password")
            return
        }

        toast.success("Login successful")
        router.push("/storage")
    }
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>

            <CardContent>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <Input
                        type="email"
                        placeholder="Email "
                        name="email"
                        required
                    />

                    <div className="relative">
                        <Input
                            name="passcode"
                            placeholder="Enter passcode"
                            type={show ? "text" : "password"}
                            required
                            className="pr-10"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => setShow(v => !v)}
                        >
                            {show ? <EyeOff /> : <Eye />}
                        </Button>
                    </div>

                    <Button type="submit" className="w-full">
                        Sign in
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
