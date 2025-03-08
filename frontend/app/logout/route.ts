import { upfetch } from "@/lib/upfetch";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const response = await upfetch(`/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      schema: z.object({
        success: z.boolean(),
      }),
    })
    return NextResponse.redirect(new URL("/", req.url))
  } catch {
    return NextResponse.redirect(new URL("/", req.url))
  }
}