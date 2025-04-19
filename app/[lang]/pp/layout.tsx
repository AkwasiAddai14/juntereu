

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


import '@/app/globals.css'
import NavBar from "@/app/[lang]/components/shared/navigation/NavBar";
import Footer from "@/app/[lang]/components/shared/navigation/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Junter",
  description: "Making Money Fast",
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

          <main className="flex flex-row justify-center items-center min-h-screen">

            <section className="main-container flex justify-center items-center">
              <div className='w-full max-w-4xl'>{children}</div>
            </section>
            {/* @ts-ignore */}
          </main>

          <Footer lang={"en"} />
        </body>
      </html>
   
  );
}