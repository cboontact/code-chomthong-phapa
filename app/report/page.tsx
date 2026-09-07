import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { listDashboard } from "@/lib/donations";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

const money = new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateTime = new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" });

export default async function ReportPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/");
  const data = await listDashboard();

  return <main className="report-shell">
    <div className="report-toolbar no-print">
      <div><p>ตัวอย่างก่อนพิมพ์</p><span>ตรวจสอบข้อมูลให้เรียบร้อย แล้วจึงกดปุ่มพิมพ์</span></div>
      <div className="report-actions"><Link href="/" className="btn btn-soft"><i className="fa-solid fa-arrow-left" />กลับหน้าจัดการ</Link><PrintButton /></div>
    </div>
    <article className="report-page">
      <header className="report-header">
        <Image src="/img/logo.png" width={82} height={82} alt="ตราโรงเรียนจอมทอง" className="report-logo" priority />
        <div><p>โรงเรียนจอมทอง จังหวัดเชียงใหม่</p><h1>รายงานสรุปยอดผ้าป่า</h1><h2>ระบบนับยอดผ้าป่าโรงเรียนจอมทอง</h2></div>
        <div className="report-total"><span>ยอดผ้าป่ารวมทั้งหมด</span><strong>{money.format(data.totalAmount)}</strong><small>บาท</small></div>
      </header>
      <table className="report-table">
        <thead><tr><th className="report-col-number">ลำดับ</th><th className="report-col-batch">รุ่นที่</th><th>ชื่อรุ่น / กลุ่ม</th><th>หมายเหตุ</th><th className="report-col-payment">เงินสด</th><th className="report-col-payment">เงินโอน</th><th className="report-col-date">วันที่และเวลา</th><th className="report-col-amount">รวม (บาท)</th></tr></thead>
        <tbody>{data.donations.length === 0 ? <tr><td colSpan={8} className="report-empty">ยังไม่มีรายการผ้าป่า</td></tr> : data.donations.map((donation, index) => <tr key={donation.id}><td className="center">{index + 1}</td><td className="center batch">{donation.batchNumber}</td><td className="name">{donation.batchName}</td><td className="note">{donation.note || "-"}</td><td className="amount">{money.format(donation.cashAmount)}</td><td className="amount">{money.format(donation.transferAmount)}</td><td className="center date">{dateTime.format(new Date(donation.receivedAt))}</td><td className="amount">{money.format(donation.amount)}</td></tr>)}</tbody>
        <tfoot><tr><td colSpan={4}>รวมทั้งสิ้น ({data.totalRecords} รายการ)</td><td className="amount">{money.format(data.totalCashAmount)}</td><td className="amount">{money.format(data.totalTransferAmount)}</td><td></td><td className="amount">{money.format(data.totalAmount)}</td></tr></tfoot>
      </table>
      <section className="report-signatures">
        <Signature name="นางสาววัลภมาภรค์ อาจนาเสียว" position="ผู้อำนวยการโรงเรียน" />
        <Signature name="นางสาววิชชุดา กันทะมาลา" position="ผู้ช่วยผู้อำนวยการกลุ่มงานบัญชีและการเงิน" />
        <Signature name="........................................" position="หัวหน้างาน" />
      </section>
      <footer className="report-footer"><span>ระบบนับยอดผ้าป่า โรงเรียนจอมทอง</span><span className="report-page-number" /></footer>
    </article>
  </main>;
}

function Signature({ name, position }: { name: string; position: string }) {
  return <div><p>ลงชื่อ ................................................</p><p>({name})</p><p>ตำแหน่ง {position}</p></div>;
}
