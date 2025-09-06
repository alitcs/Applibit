import {
  getAuth,
  onAuthStateChanged,
  reload,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { app, auth, db, firebaseConfig } from "./myfirebase.js";

const paymentLink =
  "https://billing.stripe.com/p/login/test_dRmfZg5ca75M5QUgHJg3600";
const FN_URL =
  "http://127.0.0.1:5001/applibit-28066/us-central1/createCheckoutSession";

async function startCheckout() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  const idToken = await user.getIdToken();

  const resp = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + idToken,
    },
    body: JSON.stringify({}),
  });

  const data = await resp.json();
  if (data?.url) {
    window.location.href = data.url;
  } else {
    console.error("Checkout error", data);
    alert(data?.error || "Error starting checkout");
  }
}

//Sign Up
const emailInput = document.getElementById("email");
const usernameSign = document.getElementById("username-sign");
const passwordSign = document.getElementById("password-sign");
const confirmPassword = document.getElementById("confirm-password");
const verifyEmailBtn = document.getElementById("verify-email-btn");

//Login
const loginEmailInput = document.getElementById("username-log");
const loginPassword = document.getElementById("password-log");
const loginSubmitBtn = document.getElementById("log-in-submit");

loginSubmitBtn?.addEventListener("click", async () => {
  await myLogin(auth, loginEmailInput, loginPassword);
});

function setFeedback(inputEl, msg) {
  const group = inputEl?.closest(".input-group");
  const box = group?.querySelector(".input-feedback");
  if (box) box.textContent = msg || "";
}

usernameSign.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    setFeedback(usernameSign, "");
    if (usernameSign.value.trim() === "") {
      setFeedback(usernameSign, "Please enter a username.");
    }
  }
});

passwordSign.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    setFeedback(passwordSign, "");
    if (passwordSign.value.trim() === "") {
      setFeedback(passwordSign, "Please enter a password.");
    }
  }
});

confirmPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    setFeedback(confirmPassword, "");
    if (confirmPassword.value.trim() === "") {
      setFeedback(confirmPassword, "Please confirm your password.");
    }
    if (confirmPassword.value !== passwordSign.value) {
      setFeedback(confirmPassword, "Passwords do not match.");
    }
  }
});

export async function waitForEmailVerification({
  intervalMs = 3000,
  timeoutMs = 20 * 60 * 1000,
} = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const user = auth.currentUser;
    if (!user) throw new Error("Signed out while waiting for verification.");
    await reload(user);
    // (Optional) force refresh ID token so backend sees the claim immediately:
    await user.getIdToken(true);
    if (user.emailVerified) return user; // <-- resolve here
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Email not verified (timeout).");
}

verifyEmailBtn.addEventListener("click", async () => {
  const email = emailInput?.value.trim();
  const pwd = passwordSign?.value || "";
  const cpwd = confirmPassword?.value || "";
  const uname = usernameSign?.value.trim();

  try {
    window.lock?.();

    const cred = await createUserWithEmailAndPassword(auth, email, pwd);
    if (uname) await updateProfile(cred.user, { displayName: uname });
    await sendEmailVerification(cred.user);
    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        email: cred.user.email,
        username: uname || null,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    setFeedback(emailInput, "Verification email sent. Check your inbox.");

    const user = await waitForEmailVerification({ intervalMs: 3000 });
    const startedKey = "checkoutStarted";

    if (!localStorage.getItem("checkoutStarted")) {
      localStorage.setItem("checkoutStarted", "1");
      await startCheckout();
    }
  } catch (err) {
    const code = err?.code;
    switch (code) {
      case "auth/email-already-in-use":
        setFeedback(emailInput, "Email already in use");
        break;
      case "auth/invalid-email":
        setFeedback(emailInput, "Invalid email format.");
        break;
      case "auth/weak-password":
        setFeedback(emailInput, "Password is too weak.");
        break;
      default:
        setFeedback(emailInput, err?.message || "Sign-up failed.");
    }
  } finally {
    window.unlock?.();
  }
});

async function myLogin(auth, loginEmailInput, loginPassword) {
  const email = loginEmailInput?.value.trim();
  const password = loginPassword?.value || "";
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (e) {
    const code = e?.code;
    switch (code) {
      case "auth/invalid-email":
        setFeedback(loginEmailInput, "Invalid email format");
        break;
      case "auth/user-not-found":
        setFeedback(loginEmailInput, "No user found with this email");
        break;
      case "auth/wrong-password":
        setFeedback(loginPassword, "Incorrect Password");
        break;
      case "auth/too-many-requests":
        setFeedback(loginPassword, "Too many failed attempts. Try again later");
        break;
      case "auth/network-request-failed":
        setFeedback(loginPassword, "Network error. Check your connection");
        break;
      default:
        setFeedback(loginPassword, "Error logging in");
        break;
    }
  }
}
