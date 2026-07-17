import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoThai = Noto_Sans_Thai({ subsets: ["thai"], variable: "--font-noto-thai" });

export const metadata: Metadata = {
  title: "ผ้าป่า | โรงเรียนจอมทอง",
  description: "ระบบนับยอดผ้าป่า โรงเรียนจอมทอง",
  icons: {
    icon: [{ url: "/img/logo.png", type: "image/png" }],
    shortcut: "/img/logo.png",
    apple: "/img/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body className={notoThai.variable}>{children}</body></html>;
}
