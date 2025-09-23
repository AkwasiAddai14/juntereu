
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/[lang]/globals.css';
import { Toaster } from "@/app/[lang]/components/ui/toaster"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Junter",
  description: "Empowering progress , enabling growth",
  icons: {
    icon: "/Users/georgeaddai/Desktop/thejunter/thejunter/app/images/Color logo - no background.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_TEST}>
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
      
      </html>        
    </ClerkProvider>
      )};