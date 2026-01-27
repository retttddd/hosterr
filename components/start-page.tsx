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
import {ArrowUpRightIcon, Eye, EyeOff} from "lucide-react";
import Link from 'next/link'

export function StartPage() {
  return (
    <ExampleWrapper>
      <Title>
        Initialize new storage or connect existing

          <Button onClick={() => { }} size="sm">
            <Link href="/existingstorage">
              Log in
            </Link>
            <ArrowUpRightIcon />
          </Button>

        <Button size="sm" variant="outline">
          Import existing
          <ArrowUpRightIcon />
        </Button>
      </Title>
      <Form />
    </ExampleWrapper>
  )
}


function Title({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-muted-foreground px-1.5 py-2 text-2xl font-medium flex flex-wrap flex-column gap-3"
    >
      {children}
    </div>
  )
}


function Form() {
  const [theme, setTheme] = React.useState("light")
  const [show, setShow] = React.useState(false)

  return (
    <Example>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Storage</CardTitle>
          <CardDescription>Please fill details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="Enter your name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-role">Status</FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="small-form-role">
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
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-defaultUser">Default User</FieldLabel>
                  <Input
                      id="small-form-defaultUser"
                      placeholder="Enter default user"
                      required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-passcode">Passcode</FieldLabel>
                  <div className="relative">
                    <Input
                        id="small-form-passcode"
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
                        onClick={() => setShow((v) => !v)}
                    >
                      {show ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>


                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="small-form-about">About</FieldLabel>
                <Textarea
                  id="small-form-about"
                  placeholder="Add any additional information"
                />
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
