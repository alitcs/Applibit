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

import { app, auth, db, firebaseConfig } from "./firebase.js";

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
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          username: uname,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    });
    setFeedback(emailInput, "Verification email sent. Check your inbox.");
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
