import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import AdminShell from "@/app/admin/components/AdminShell";
import "@/app/admin/admin-globals.css";

const outfit = Outfit({
  variable: "--font-outfit-admin",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gestor — Cruz Blanca",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${outfit.variable} admin-root`}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
