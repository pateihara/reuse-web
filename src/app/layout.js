import "./globals.css";
import { Inter, Lato } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["600"], variable: "--font-inter" });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" });

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-theme="reuse" className={`${inter.variable} ${lato.variable}`}>
      <body className="font-[var(--font-lato)]">{children}</body>
    </html>
  );
}