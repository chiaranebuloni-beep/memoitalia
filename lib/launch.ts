// Data di apertura dello shop: il conto alla rovescia della home punta qui.
// Data ufficiale di lancio (confermata il 12/11/2026).
export const LAUNCH_DATE = "2026-12-15T10:00:00+01:00";

export const launchDateLabel = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Rome",
}).format(new Date(LAUNCH_DATE));
