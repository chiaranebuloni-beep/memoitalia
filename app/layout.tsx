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

const DESCRIPTION =
  "Mèmo, la barretta buona per natura: pochi ingredienti, senza edulcoranti, senza glutine e senza lattosio. Golosa, Cocco, Arachide e Gianduia.";

export const metadata: Metadata = {
  // indirizzo pubblico: serve per gli URL assoluti dell'immagine di anteprima (app/opengraph-image.jpg)
  metadataBase: new URL("https://memoitalia.vercel.app"),
  title: "Mèmo · Il buono memorabile",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Mèmo",
    title: "Mèmo · Il buono memorabile",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
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
