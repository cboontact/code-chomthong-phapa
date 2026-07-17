"use client";

export default function PrintButton() {
  return <button type="button" onClick={() => window.print()} className="btn btn-primary"><i className="fa-solid fa-print" />พิมพ์รายงาน / บันทึก PDF</button>;
}
