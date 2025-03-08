"use client";

import { Spinner } from "@/components/ui/spinner"
import { upfetch } from "@/lib/upfetch"
import { useEffect, useState } from "react"
import { z } from "zod"

export default function Dash() {
  const [username, setUsername] = useState<string | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await upfetch(`/api/validate-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          schema: z.object({
            success: z.boolean(),
            username: z.string(),
          }),
        })
        if (response.success) {
          setUsername(response.username)
        } else {
          window.location.href = "/login"
        }
      } catch {
        window.location.href = "/login"
      }
    }
    fetchData()
  }, [])

  if (username) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Hello, {username}</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <Spinner />
      </div>
    </div>
  )
}