import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { user, event } = await req.json();

  await db.events.create({
    data: { user, event },
  });

  return NextResponse.json({ ok: true });
}
