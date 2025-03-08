"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { User, Lock } from "lucide-react";
import { upfetch } from "@/lib/upfetch"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const formSchema = z.object({
  username: z.string().min(8, {
    message: "Username must be at least 8 characters.",
  }),
  password: z.string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});


export default function Register() {
  const [error, setError] = useState<string | null>(null)
  const [strength, setStrength] = useState(5);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
    reValidateMode: "onChange"
  })

  const evaluateStrength = (password: string) => {
    let score = 5;
    if (password.length >= 8) score += 20;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[^a-zA-Z0-9]/.test(password)) score += 25;
    setStrength(score);
  };

  const getStrengthColor = () => {
    if (strength <= 25) return "bg-red-500"; // Weak
    if (strength <= 50) return "bg-orange-500"; // Moderate
    if (strength <= 75) return "bg-yellow-500"; // Strong
    return "bg-green-500"; // Very Strong
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await upfetch("/api/register", {
        method: "POST",
        body: JSON.stringify(values),
        schema: z.object({
          success: z.boolean(),
          message: z.string(),
        }),
      })
      if (response.success) {
        setError(null)
        setShowSuccessDialog(true)
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      } else {
        setError(response.message)
      }
    } catch {
      setError("An error occurred.")
    }
  }

  async function evaluateAvailability(username: string) {
    try {
      const response = await upfetch("/api/validate-username", {
        method: "POST",
        body: JSON.stringify({ username }),
        schema: z.object({
          success: z.boolean(),
          available: z.boolean(),
        }),
      })
      if (!response.success) {
        return
      }
      if (!response.available) {
        set(form.formState.errors, "username", {
          type: "manual",
          message: "Username is not available.",
        })
      } else {
        set(form.formState.errors, "username", undefined)
      }
    }
    catch {
    }
  }
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>
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
                        <User className="absolute left-3 text-gray-500" size={20} />
                        <Input
                          {...field}
                          className="pl-10 max-w-md w-full"
                          onChange={(e) => {
                            field.onChange(e);
                            evaluateAvailability(e.target.value);
                          }} />
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
                        <Lock className="absolute left-3 text-gray-500" size={20} />
                        <Input
                          {...field}
                          type="password"
                          className="pl-10 max-w-md w-full"
                          onChange={(e) => {
                            field.onChange(e);
                            evaluateStrength(e.target.value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className={cn("h-2 rounded transition-all", getStrengthColor())}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3 text-gray-500" size={20} />
                        <Input {...field} type="password" className="pl-10 max-w-md w-full" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <FormMessage className="flex justify-center">{error}</FormMessage>}
              <Button type="submit" className="w-full max-w-md" disabled={(!form.formState.isValid || form.formState.isSubmitting)}>
                Register
              </Button>
              <p className="text-center">
                Already have an account? <a href="/login" className="text-blue-500">Login here</a>
              </p>
            </form>
          </Form>
        </div>
      </div>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              Your account has been created successfully. You will be redirected to the dashboard shortly.
              <Spinner size="small" className="ml-2" />
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
