"use client"

import * as React from "react"
import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpRightIcon, Eye, EyeOff } from "lucide-react"
import { toast, Toaster } from "sonner"
import {redirect} from "next/navigation";
export function StartPage() {

  return (
      <ExampleWrapper>
        <Title>
          Initialize new storage or connect existing
          <Button size="sm" onClick={() => redirect("/login")}>
            Login
            <ArrowUpRightIcon />
          </Button>
          <Button size="sm" variant="outline">
            Import existing
            <ArrowUpRightIcon />
          </Button>
        </Title>
        <StorageForm />
        <Toaster />
      </ExampleWrapper>
  )
}

export function Title({ children }: { children: React.ReactNode }) {
  return (
      <div className="text-muted-foreground px-1.5 py-2 text-2xl font-medium flex flex-wrap gap-3">
        {children}
      </div>
  )
}


function StorageForm() {
  const [show, setShow] = React.useState(false)
  const [status, setStatus] = React.useState("active")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const body = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      defaultUser: formData.get("defaultUser") as string,
      status: status,
      storageName: formData.get("name") as string,
      about: formData.get("about") as string,
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()

      toast.success("storage created successfully")
      form.reset()
      setStatus("active")
    } catch {
      toast.error("Creation failed")
    }
  }

  return (
      <Example>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Storage</CardTitle>
            <CardDescription>Please fill details below</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit}>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field id="small-form-name" >
                    <FieldLabel>Name</FieldLabel>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Storage name"
                        id="small-form-name"
                        required
                    />
                  </Field>
                  <Field id="status">
                    <FieldLabel>Status</FieldLabel>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Default User</FieldLabel>
                    <Input
                        name="defaultUser"
                        placeholder="Enter default user"
                        required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Passcode</FieldLabel>
                    <div className="relative">
                      <Input
                          name="password"
                          placeholder="Enter password"
                          type={show ? "text" : "password"}
                          required
                          className="pr-10"
                      />
                      <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShow((v) => !v)}
                      >
                        {show ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>About</FieldLabel>
                  <Textarea id="about" name="about" />
                </Field>

                <Field orientation="horizontal">
                  <Button type="submit">Create</Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </Example>
  )
}
