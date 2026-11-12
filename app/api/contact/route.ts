import { NextResponse } from "next/server";
import { addContact } from "@/lib/store";
import { backendEnabled, forwardToBackend } from "@/lib/backend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

// Messaggi dalla pagina Contatti: privati e rivenditori.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  if (backendEnabled) {
    return forwardToBackend("/contact/", req, body, "Il modulo non è ancora attivo: scrivici a info@memoitalia.it.");
  }

  const kind = body.kind === "rivenditore" ? "rivenditore" : "privato";
  const name = clean(body.name, 80);
  const email = clean(body.email, 160).toLowerCase();
  const message = clean(body.message, 3000);
  const company = clean(body.company, 120);

  if (!name) return NextResponse.json({ error: "Come ti chiami?" }, { status: 422 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Controlla l'email." }, { status: 422 });
  if (kind === "rivenditore" && !company) return NextResponse.json({ error: "Qual è il nome dell'attività?" }, { status: 422 });
  if (kind === "privato" && message.length < 5) return NextResponse.json({ error: "Scrivici il tuo messaggio." }, { status: 422 });
  if (body.privacy !== true) return NextResponse.json({ error: "Serve l'accettazione dell'informativa privacy." }, { status: 422 });

  try {
    await addContact({
      kind,
      name,
      email,
      message,
      phone: clean(body.phone, 30) || undefined,
      company: company || undefined,
      business: clean(body.business, 60) || undefined,
      city: clean(body.city, 80) || undefined,
    });
  } catch (err) {
    console.error("contact: store unavailable", err);
    return NextResponse.json({ error: "Il modulo non è ancora attivo: scrivici a info@memoitalia.it." }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
