import { promises as fs } from "fs";
import path from "path";

// Archivio minimale su file JSON per lo sviluppo in locale.
// In produzione va sostituito con un database (es. Postgres) senza cambiare le API.

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, target);
}

export type FounderSignup = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsappConsent: boolean;
  marketingConsent: boolean;
  createdAt: string;
};

export async function addFounder(input: Omit<FounderSignup, "id" | "createdAt">) {
  const list = await readJson<FounderSignup[]>("founders.json", []);
  const existing = list.find((f) => f.email === input.email);
  if (existing) return { signup: existing, created: false };
  const signup: FounderSignup = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  list.push(signup);
  await writeJson("founders.json", list);
  return { signup, created: true };
}
