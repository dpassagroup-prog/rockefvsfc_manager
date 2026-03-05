import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthProvider } from "./AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ROCKEFVSFC Manager",
  description: "Modern Management Information System for Rockefvs Football Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background text-foreground">
              <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <Link href="/" className="text-xl font-bold">
                        ROCKEFVSFC Manager
                      </Link>
                      <nav className="hidden md:flex space-x-6">
                        <Link href="/" className="hover:text-primary transition-colors">
                          Home
                        </Link>
                        <Link href="/about" className="hover:text-primary transition-colors">
                          About
                        </Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">
                          Contact
                        </Link>
                      </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                      <ThemeToggle />
                      <Button variant="outline" asChild>
                        <Link href="/api/auth/login">Login</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/api/auth/login">Sign Up</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </header>
              <main>{children}</main>
              <footer className="border-t mt-12">
                <div className="container mx-auto px-4 py-6">
                  <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} ROCKEFVSFC Manager. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
