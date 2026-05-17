import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-poppins', // Changed from --font-primary to --font-poppins
})

export const metadata: Metadata = {
    title: "Recipe Meal Planner",
    description: "Plan your meals, save recipes, and generate grocery lists",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={poppins.variable}>
            <body className={`${poppins.className} bg-gray-50 dark:bg-gray-900`}>
                <Navbar/>
                <main>{children}</main>
                <Toaster position="top-right"/>
            </body>
        </html>
    );
}