import { upfetch } from "@/lib/upfetch";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const response = await upfetch(`/api/validate-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      schema: z.object({
        success: z.boolean(),
        username: z.string().nullable(),
      }),
    })
    if (response.success) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    } else {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}