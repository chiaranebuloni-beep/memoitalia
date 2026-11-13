// Documenti legali generati con iubenda (progetto "www.memoitalia.it", account info@memoitalia.it, piano Advanced).
// Si modificano dal pannello di iubenda: i link restano uguali.
const IUBENDA_ID = "37315198";

export const PRIVACY_URL = `https://www.iubenda.com/privacy-policy/${IUBENDA_ID}`;
export const COOKIE_URL = `${PRIVACY_URL}/cookie-policy`;
export const TERMS_URL = `https://www.iubenda.com/termini-e-condizioni/${IUBENDA_ID}`;

// Banner dei cookie (Privacy Controls and Cookie Solution)
export const IUBENDA_BANNER_SRC = "https://embeds.iubenda.com/widgets/841f2f78-b1ed-4427-a488-33aeb16e744c.js";

type IubendaWindow = Window & { _iub?: { cs?: { api?: { openPreferences?: () => void } } } };

// Riapre le preferenze dei cookie (link "Preferenze cookie" nel footer, al posto del widget fisso)
export function openCookiePreferences() {
  (window as IubendaWindow)._iub?.cs?.api?.openPreferences?.();
}
