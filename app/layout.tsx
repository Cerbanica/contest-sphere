
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'; // Import ThemeProvider
import { Navbar } from "./components";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contest Sphere",
  description: "Thousands of contests, all in one place",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ensure the app renders the theme correctly during SSR

  return (
    <html lang="en">

      <body className=' main overflow-x-hidden'>
        <ThemeProvider attribute="class">
          <Navbar />
          <div className="flex flex-col min-h-screen  main ">

            <main className="flex-grow">
              <Suspense fallback={<div>Loading...</div>}>

                {children}
              </Suspense>
            </main>



          </div>
          <div className="w-full default  lg:mt-4 p-4 border border-t text-center "><span className="text-cs">Contest Sphere By Cerbanica 2024</span></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
