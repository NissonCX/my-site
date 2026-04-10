import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar, Footer } from "@/components/layout";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "NissonCX - 个人主页",
    template: "%s | NissonCX",
  },
  description: "重庆大学 CS 本科大三在读，前趣链科技 Java 后端开发实习，即将入职字节跳动（懂车帝）后端开发实习。热衷技术细节与 Agent 开发探索。",
  keywords: ["Java", "Spring Boot", "后端开发", "Agent", "Multi-Agent", "TypeScript", "Node.js", "重庆大学", "个人主页", "NissonCX"],
  authors: [{ name: "NissonCX" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://caoxu.xyz",
    siteName: "NissonCX",
    title: "NissonCX - 个人主页",
    description: "重庆大学 CS 本科大三在读，前趣链科技 Java 后端开发实习，即将入职字节跳动（懂车帝）后端开发实习。热衷技术细节与 Agent 开发探索。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-full flex flex-col bg-background text-foreground font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
