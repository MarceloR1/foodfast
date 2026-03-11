import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodFast | Delicious Food Delivered Fast",
  description: "Experience premium food delivery with FoodFast. The best restaurants in your city, delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark text-white selection:bg-primary selection:text-dark`}>
        {children}
      </body>
    </html>
  );
}
