// ESM + v2 API
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { initializeApp as initAdmin } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";

initAdmin();
const db = getFirestore();

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
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");

// put your values from earlier:
const PRICE_ID = "price_1S3PtOCtKtEnJmX70OTMhYLc"; // e.g. price_123
const SUCCESS_URL = "http://127.0.0.1:5500/dashboard.html";
const CANCEL_URL = "http://127.0.0.1:5500/index.html";

export const stripeWebhook = onRequest(
  {
    secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET],
    rawBody: true,
    maxInstances: 1,
    timeoutSeconds: 30,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY.value());

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      return res
        .status(400)
        .send(`Webhook signature verification failed: ${err.message}`);
    }

    const seenRef = db.collection("stripe_webhook_events").doc(event.id);
    const seenSnap = await seenRef.get();
    if (seenSnap.exists) {
      return res.sendStatus(200);
    }

    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      const uid = s.client_reference_id || s.metadata?.uid;
      const customer = s.customer || null;
      const subscription = s.subscription || null;

      if (uid) {
        await db.doc(`users/${uid}`).set(
          {
            stripeCustomerId: customer,
            stripeSubscriptionId: subscription,
            subStatus: "active",
            updatedAt: new Date(),
          },
          { merge: true }
        );
        await getAdminAuth().setCustomUserClaims(uid, { subActive: true });
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object;

      let uid = sub.metadata?.uid;
      if (!uid && sub.customer) {
        const snap = await db
          .collection("users")
          .where("stripeCustomerId", "==", sub.customer)
          .limit(1)
          .get();
        if (!snap.empty) uid = snap.docs[0].id;
      }

      if (uid) {
        await db.doc(`users/${uid}`).set(
          {
            subStatus: sub.status,
            current_period_end: sub.current_period_end
              ? sub.current_period_end * 1000
              : null,
            updatedAt: new Date(),
          },
          { merge: true }
        );
        await getAdminAuth().setCustomUserClaims(uid, {
          subActive: sub.status === "active",
        });
      }
    }
    return res.sendStatus(200);
  }
);

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
      return res.status(405).json({ error: "Method not allowed Ali" });
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
        subscription_data: {
          metadata: { uid: user.uid },
        },
        // You can collect billing address, tax info, etc. later if needed.
      });

      return res.status(200).json({ url: session.url });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: String(err.message || err) });
    }
  }
);
