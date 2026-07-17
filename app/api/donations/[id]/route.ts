import { NextResponse } from "next/server";
import { removeDonation, updateDonation } from "@/lib/donations";
import { validate } from "../route";
import { getAdminSession } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, { params }: Context) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบผู้ดูแล" }, { status: 401 });
  const valid = validate(await request.json());
  if (!valid.data) return NextResponse.json({ message: valid.error }, { status: 400 });
  if (!await updateDonation((await params).id, valid.data, admin)) return NextResponse.json({ message: "ไม่พบรายการ" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: Context) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบผู้ดูแล" }, { status: 401 });
  if (!await removeDonation((await params).id, admin)) return NextResponse.json({ message: "ไม่พบรายการ" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
