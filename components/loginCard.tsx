"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import {toast} from "sonner";

export function LoginCard() {
    //const router = useRouter();
    const [show, setShow] = React.useState(false)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        try {
            const response: unknown = await signIn("credentials", {
                email: form.email.value,
                password: form.passcode.value,
                redirect: false,
            });
            console.log({ response });
            if (!response?.error) {
                console.log("Login Successful");
            }

            if (!response?.ok) {
                throw new Error("Network response was not ok");
            }
            toast.success("Login Successful");
        } catch (error: any) {
            console.error("Login Failed:", error);
            toast.error("Login Failed");
        }
    };
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
