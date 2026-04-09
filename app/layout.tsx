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
  description: "重庆大学计科大三在读，趣链科技 Java 后端开发。热衷于技术细节，喜欢把每一个技术细节发掘到极致。",
  keywords: ["Java", "Spring Boot", "后端开发", "微服务", "AI", "个人主页", "NissonCX"],
  authors: [{ name: "NissonCX" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://caoxu.xyz",
    siteName: "NissonCX",
    title: "NissonCX - 个人主页",
    description: "重庆大学计科大三在读，趣联科技 Java 后端开发。热衷于技术细节，喜欢把每一个技术细节发掘到极致。",
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