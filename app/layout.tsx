
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

      <body className='relative '>
        <ThemeProvider attribute="class">
          <Navbar />
          <div className="flex flex-col min-h-screen pt-4 bg-gray-200 text-black dark:bg-gray-800 dark:text-white">

            <main className="flex-grow">
              <Suspense fallback={<div>Loading...</div>}>

                {children}
              </Suspense>
            </main>



          </div>
          <footer className="flex flex-col w-full pt-4 text-center bg-white dark:bg-gray-800">
            <span className="flex bg-transparent w-full order border-cs"></span>
            <p className="bg-white py-4 dark:bg-gray-800">ContestSphere</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
