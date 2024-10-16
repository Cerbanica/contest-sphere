
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'; // Import ThemeProvider
import { Navbar } from "./components";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContestSphere",
  description: "We the best Music",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ensure the app renders the theme correctly during SSR

  return (
    <html lang="en">

      <body className='relative main overflow-x-hidden'>
        <ThemeProvider attribute="class">
          <Navbar />
          <div className="flex flex-col min-h-screen pt-4 main ">

            <main className="flex-grow">
              <Suspense fallback={<div>Loading...</div>}>

                {children}
              </Suspense>
            </main>



          </div>
          <footer className="flex flex-col w-full  text-center main ">
            <span className="flex bg-transparent w-full order border-cs "></span>
            <p className="py-4 default">Contest Sphere 2024</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
