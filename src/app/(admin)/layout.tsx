import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Ratnagiri",
  description: "Ratnagiri Admin Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
