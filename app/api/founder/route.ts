import { NextResponse } from "next/server";
import { addFounder } from "@/lib/store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s]{8,16}$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 80);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 160);
  const phone = String(body.phone ?? "").trim();
  const whatsappConsent = body.whatsappConsent === true;
  const privacy = body.privacy === true;

  if (!name) return NextResponse.json({ error: "Come ti chiami?" }, { status: 422 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Controlla l'email." }, { status: 422 });
  if (phone && !PHONE_RE.test(phone))
    return NextResponse.json({ error: "Il numero WhatsApp non sembra corretto." }, { status: 422 });
  if (phone && !whatsappConsent)
    return NextResponse.json({ error: "Serve il consenso per scriverti su WhatsApp." }, { status: 422 });
  if (!privacy) return NextResponse.json({ error: "Serve l'accettazione dell'informativa privacy." }, { status: 422 });

  let created: boolean;
  try {
    ({ created } = await addFounder({
      name,
      email,
      phone: phone || undefined,
      whatsappConsent: Boolean(phone) && whatsappConsent,
      marketingConsent: privacy,
    }));
  } catch (err) {
    // Senza un archivio scrivibile (es. Vercel senza database) non perdiamo dati in silenzio.
    console.error("founder signup: store unavailable", err);
    return NextResponse.json(
      { error: "Le iscrizioni aprono a brevissimo: riprova tra qualche giorno!" },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, alreadyIn: !created }, { status: created ? 201 : 200 });
}
