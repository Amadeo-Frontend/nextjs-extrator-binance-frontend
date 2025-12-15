import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const activeSessions = await db.sessions.count();
  const visitsToday = await db.events.count({
    where: { event: "pageview" },
  });
  const totalEvents = await db.events.count();
  const toolUsage = await db.events.count({
    where: { event: "tool_used" },
  });

  return NextResponse.json({
    activeSessions,
    visitsToday,
    totalEvents,
    toolUsage,
  });
}
