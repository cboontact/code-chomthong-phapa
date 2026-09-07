import { NextResponse } from "next/server";
import { createDonation, listDashboard } from "@/lib/donations";
import type { DonationInput } from "@/lib/types";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function validate(payload: unknown): { data?: DonationInput; error?: string } {
  const value = payload as Partial<DonationInput>;
  const batchNumber = value.batchNumber?.trim();
  const batchName = value.batchName?.trim();
  const cashAmount = Number(value.cashAmount ?? 0);
  const transferAmount = Number(value.transferAmount ?? 0);
  if (!batchNumber || !batchName) return { error: "กรุณากรอกรุ่นที่และชื่อรุ่นให้ครบ" };
  if (!Number.isFinite(cashAmount) || cashAmount < 0 || !Number.isFinite(transferAmount) || transferAmount < 0) return { error: "จำนวนเงินสดและเงินโอนต้องเป็นจำนวนตั้งแต่ 0 บาท" };
  if (cashAmount + transferAmount <= 0) return { error: "กรุณาระบุเงินสดหรือเงินโอนอย่างน้อย 1 บาท" };
  return { data: { batchNumber, batchName, cashAmount, transferAmount, note: value.note?.trim() ?? "" } };
}

export async function GET() { return NextResponse.json(await listDashboard()); }
export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบผู้ดูแล" }, { status: 401 });
  const valid = validate(await request.json());
  if (!valid.data) return NextResponse.json({ message: valid.error }, { status: 400 });
  const id = await createDonation(valid.data, admin);
  return NextResponse.json({ id }, { status: 201 });
}

export { validate };
