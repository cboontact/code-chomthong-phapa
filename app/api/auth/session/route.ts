import { NextResponse } from "next/server";
import { createAdminSession, deleteAdminSession, getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() { const user = await getAdminSession(); return NextResponse.json({ authenticated: Boolean(user), user }); }
export async function POST(request: Request) {
  const body = await request.json() as { username?: string; password?: string };
  const user = body.username && body.password ? await createAdminSession(body.username, body.password) : false;
  if (!user) return NextResponse.json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  return NextResponse.json({ authenticated: true, user });
}
export async function DELETE() { await deleteAdminSession(); return NextResponse.json({ authenticated: false }); }
