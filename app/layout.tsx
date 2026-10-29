import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Archivo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import SmoothScroll from "@/components/SmoothScroll";

const bomega = localFont({
  src: "../public/fonts/Bomega.woff2",
  variable: "--font-display",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mèmo · Il buono memorabile",
  description:
    "Mèmo, la barretta buona per natura: pochi ingredienti, senza edulcoranti, senza glutine e senza lattosio. Golosa, Cocco, Arachide e Gianduia.",
  icons: { icon: "/img/brand/monogram.png" },
};

export const viewport: Viewport = {
  themeColor: "#0b4ea2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${bomega.variable} ${archivo.variable}`}>
      <body>
        <CartProvider>
          <SmoothScroll />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
