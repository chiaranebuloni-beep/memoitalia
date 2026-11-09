import { NextResponse, type NextRequest } from "next/server";

// Sul dominio del cliente (memoitalia.it) per ora si vede solo la home:
// ogni altra pagina rimanda alla home. Su memoitalia.vercel.app e in locale resta tutto il sito.
// Per aprire tutto il sito anche sul dominio basta togliere questo file.
const HOME_ONLY_HOSTS = new Set(["memoitalia.it", "www.memoitalia.it"]);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!HOME_ONLY_HOSTS.has(host) || request.nextUrl.pathname === "/") return NextResponse.next();
  const home = request.nextUrl.clone();
  home.pathname = "/";
  home.search = "";
  return NextResponse.redirect(home, 307);
}

// Solo le pagine: file statici, immagini, font, icone e API (es. il modulo "Avvisami al lancio") passano senza controllo.
export const config = {
  matcher: ["/((?!_next/|api/|img/|fonts/|favicon\\.ico|icon\\.png|apple-icon\\.png|opengraph-image|twitter-image|robots\\.txt|sitemap\\.xml).*)"],
};
