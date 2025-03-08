"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { User, Lock } from "lucide-react";
import { upfetch } from "@/lib/upfetch"

const formSchema = z.object({
  username: z.string().min(8, {
    message: "Username must be at least 8 characters.",
  }),
  password: z.string()
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
})

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "all",
    reValidateMode: "onChange"
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await upfetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        schema: z.object({
          success: z.boolean(),
          message: z.string(),
        }),
      })
      if (response.success) {
        setError(null)
        window.location.href = "/dash"
      } else {
        setError(response.message)
      }
    } catch {
      setError("An error occurred.")
    }
  }
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md dark:bg-zinc-900">
          <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 text-gray-500 dark:text-white" size={20} />
                        <Input {...field} className="pl-10 max-w-md w-full" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3 text-gray-500 dark:text-white" size={20} />
                        <Input {...field} type="password" className="pl-10 max-w-md w-full" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <FormMessage className="flex justify-center text-red-500">{error}</FormMessage>}
              <Button type="submit" className="w-full max-w-md" disabled={(!form.formState.isValid || form.formState.isSubmitting)}>
                Submit
              </Button>
              <p className="text-center">
                Don't have an account? <a href="/register" className="text-blue-500">Register here</a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
