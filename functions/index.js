// ESM + v2 API
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app"; // <-- modular import

setGlobalOptions({ maxInstances: 10 });
initializeApp(); // <-- works with v12 ESM

export const ping = onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.status(204).send("");
  }
  return res.status(200).json({ ok: true, ts: Date.now() });
});
