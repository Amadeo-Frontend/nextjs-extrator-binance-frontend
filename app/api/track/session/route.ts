import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { user } = await req.json();

  await db.sessions.upsert({
    where: { user },
    update: { last_active: new Date() },
    create: {
      user,
      start_at: new Date(),
      last_active: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
