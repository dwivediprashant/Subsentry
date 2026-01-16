import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // 1. Import Poppins
import "./globals.css";

// 2. Configure it (Poppins requires defining weights)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins", // Optional: allows Tailwind usage
});

export const metadata: Metadata = {
  title: "SubSentry",
  description: "Manage your subscriptions automatically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Apply the class to the body */}
      <body className={`${poppins.className} antialiased bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}