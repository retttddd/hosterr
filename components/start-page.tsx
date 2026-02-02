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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast, Toaster } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import {useRouter} from "next/router";

/* ---------------- schema ---------------- */

const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Email is required"),
  status: z.enum(["active", "inactive", "suspended"]),
  defaultUser: z.string().min(2, "Default user is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  about: z.string().optional(),
})

type FormData = z.infer<typeof FormSchema>

/* ---------------- page ---------------- */

export function StartPage() {

  return (
      <ExampleWrapper>
        <Title>
          Initialize new storage or connect existing
          <Button size="sm">
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
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      status: undefined,
      email: "",
      defaultUser: "",
      password: "",
      about: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error()

      toast.success("Storage created successfully")
      form.reset()
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field id="small-form-name" >
                    <FieldLabel>Name</FieldLabel>
                    <Input placeholder="Storage name" id="small-form-name"  {...form.register("name")} />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.name.message}
                        </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                        onValueChange={(v) =>
                            form.setValue("status", v as FormData["status"])
                        }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.status && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.status.message}
                        </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>Default User</FieldLabel>
                    <Input {...form.register("defaultUser")} />
                    {form.formState.errors.defaultUser && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.defaultUser.message}
                        </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Passcode</FieldLabel>
                    <div className="relative">
                      <Input
                          {...form.register("password")}
                          type={show ? "text" : "password"}
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
                    {form.formState.errors.passcode && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.passcode.message}
                        </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input {...form.register("email")} />
                    {form.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.email.message}
                        </p>
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel>About</FieldLabel>
                  <Textarea {...form.register("about")} />
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
