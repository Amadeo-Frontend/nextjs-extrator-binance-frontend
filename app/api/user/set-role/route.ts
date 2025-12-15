import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { userId, role } = await req.json();

  if (!["admin", "user"].includes(role)) {
    return NextResponse.json({ error: "Role inválida" }, { status: 400 });
  }

  await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);

  return NextResponse.json({ success: true });
}
