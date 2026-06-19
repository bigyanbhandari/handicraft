import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ratnagiri — Handcrafted Indian Jewelry",
    template: "%s | Ratnagiri",
  },
  description: "Discover exquisite handcrafted Indian jewelry — Temple, Kundan, Jadau, Silver, Brass & Gemstone pieces. Each tells a story of heritage and artistry.",
  keywords: ["Indian jewelry", "Temple jewelry", "Kundan jewelry", "Jadau jewelry", "handcrafted jewelry", "silver jewelry", "gemstone jewelry", "traditional jewelry"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ratnagiri",
    title: "Ratnagiri — Handcrafted Indian Jewelry",
    description: "Discover exquisite handcrafted Indian jewelry — Temple, Kundan, Jadau, Silver, Brass & Gemstone pieces.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </body>
    </html>
  );
}