import { NextResponse } from "next/server";
import { getDashboardRevision } from "@/lib/donations";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ revision: await getDashboardRevision() });
}
