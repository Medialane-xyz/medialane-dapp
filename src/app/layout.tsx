import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { StarknetProvider } from "@/components/starknet-provider";
import { CommandMenu } from "@/components/command-menu"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#000000",
}

export const metadata: Metadata = {
  title: "Medialane",
  description: "Create, Trade, Remix, and Monetize on the Integrity Web.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-foreground overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <StarknetProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CommandMenu />
            <Toaster />
          </StarknetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
