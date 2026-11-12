import { NextResponse, type NextRequest } from "next/server";
import { SHOP_OPEN } from "./lib/shop";

// Cosa si vede sul dominio del cliente (memoitalia.it e www):
//   "tutto"        → tutto il sito (dal 12/11/2026), shop compreso solo se SHOP_OPEN (lib/shop.ts)
//   "home"         → solo la home; ogni altra pagina rimanda alla home
//   "costruzione"  → la pagina "Sito in costruzione" (app/in-costruzione, oggi solo in locale); ogni altra pagina rimanda lì
// Su memoitalia.vercel.app e in locale resta sempre tutto il sito.
// Per cambiare: modifica questa riga e pubblica.
const DOMAIN_MODE = "tutto" as "tutto" | "home" | "costruzione";

const DOMAIN_HOSTS = new Set(["memoitalia.it", "www.memoitalia.it"]);
// Pagine dello shop: con lo shop chiuso rimandano alla home, su ogni indirizzo
const SHOP_PATHS = /^\/(shop|checkout|ordine)(\/|$)/;

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;
  const toHome = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url, 307);
  };

  if (!SHOP_OPEN && SHOP_PATHS.test(pathname)) return toHome();
  if (!DOMAIN_HOSTS.has(host) || DOMAIN_MODE === "tutto") return NextResponse.next();

  if (DOMAIN_MODE === "costruzione") {
    // l'indirizzo resta memoitalia.it, ma si vede la pagina in costruzione
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/in-costruzione";
      return NextResponse.rewrite(url);
    }
    return toHome();
  }

  return pathname === "/" ? NextResponse.next() : toHome();
}

// Solo le pagine: file statici, immagini, font, icone e API (es. il modulo "Avvisami al lancio") passano senza controllo.
export const config = {
  matcher: ["/((?!_next/|api/|img/|fonts/|favicon\\.ico|icon\\.png|apple-icon\\.png|opengraph-image|twitter-image|robots\\.txt|sitemap\\.xml).*)"],
};
