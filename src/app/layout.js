//src/app/layout.js
import "./globals.css";
import { Inter, Lato } from "next/font/google";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["600"], variable: "--font-inter" });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" });

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-theme="reuse" className={`${inter.variable} ${lato.variable}`}>
      <body className="font-[var(--font-lato)]">
        <Header />
        {/* ajuste esse padding-top conforme a altura do seu header fixed */}
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}