// ESM + v2 API
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import Stripe from "stripe";
import { app } from "./myfirebase.js";

setGlobalOptions({ maxInstances: 10 });

export const ping = onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.status(204).send("");
  }
  return res.status(200).json({ ok: true, ts: Date.now() });
});

// 1) secrets and constants
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");

// put your values from earlier:
const PRICE_ID = "price_1S3PtOCtKtEnJmX70OTMhYLc"; // e.g. price_123
const SUCCESS_URL = "http://127.0.0.1:5500/dashboard.html";
const CANCEL_URL = "http://127.0.0.1:5500/index.html";

// 2) helper: verify Firebase ID token from Authorization header
async function verifyFirebaseUser(req) {
  const authHeader = req.headers.authorization || "";
  const m = authHeader.match(/^Bearer (.+)$/);
  if (!m) throw new Error("Missing Authorization Bearer token");
  const idToken = m[1];
  const decoded = await getAdminAuth().verifyIdToken(idToken);
  return decoded; // contains uid, email, etc.
}

// 3) create checkout session (subscription)
export const createCheckoutSession = onRequest(
  { secrets: [STRIPE_SECRET_KEY] },
  async (req, res) => {
    // CORS (allow your local site; later restrict to your prod domain)
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST,OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
      return res.status(204).send("");
    }
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const user = await verifyFirebaseUser(req); // must be signed in
      const stripe = new Stripe(STRIPE_SECRET_KEY.value());

      // create a session pointing to your price
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        // tie Stripe objects back to your Firebase user:
        client_reference_id: user.uid,
        customer_email: user.email || undefined,
        success_url: SUCCESS_URL + "?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: CANCEL_URL,
        // You can collect billing address, tax info, etc. later if needed.
      });

      return res.status(200).json({ url: session.url });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: String(err.message || err) });
    }
  }
);
