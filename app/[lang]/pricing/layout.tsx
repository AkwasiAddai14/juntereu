import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/globals.css'
import NavBar from "@/app/[lang]/components/shared/navigation/NavBar";
import Footer from "@/app/[lang]/components/shared/navigation/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Junter",
  description: "Empowering progress , enabling growth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
    <html lang='en'>
    <body className={inter.className}>
    <NavBar lang={"en"} />
      <main>
        <section>
          <div>{children}</div>
        </section>
      </main>
      <Footer lang={"en"} />
    </body>
  </html>
   
  );
}