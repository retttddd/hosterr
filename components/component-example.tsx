"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { RiAddLine, RiBluetoothLine, RiMore2Line, RiFileLine, RiFolderLine, RiFolderOpenLine, RiCodeLine, RiMoreLine, RiSearchLine, RiSaveLine, RiDownloadLine, RiEyeLine, RiLayoutLine, RiPaletteLine, RiSunLine, RiMoonLine, RiComputerLine, RiUserLine, RiBankCardLine, RiSettingsLine, RiKeyboardLine, RiTranslate, RiNotificationLine, RiMailLine, RiShieldLine, RiQuestionLine, RiFileTextLine, RiLogoutBoxLine } from "@remixicon/react"
import {ArrowUpRightIcon, Eye, EyeOff} from "lucide-react";

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <Title>
        Initialize new storage or connect existing
        <Button size="xs">
          Manage existing
          <ArrowUpRightIcon />
        </Button>
        <Button size="xs" variant="outline">
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
      className="text-muted-foreground px-1.5 py-2 text-xl font-medium flex flex-wrap flex-column gap-3"
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
          <CardTitle>Storage Information</CardTitle>
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
