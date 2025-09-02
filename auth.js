import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  reload,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBcy0uAVjrTqykSw9fNswmuuktxywCSyM",
  authDomain: "applibit-28066.firebaseapp.com",
  projectId: "applibit-28066",
  storageBucket: "applibit-28066.firebasestorage.app",
  messagingSenderId: "787697335155",
  appId: "1:787697335155:web:94e4658593b2d44ad56306",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//Sign Up
const emailInput = document.getElementById("email");
const usernameSign = document.getElementById("username-sign");
const passwordSign = document.getElementById("password-sign");
const confirmPassword = document.getElementById("confirm-password");
const verifyEmailBtn = document.getElementById("verify-email-btn");

//Login
const loginEmailInput = document.getElementById("username-log");
const loginPassword = document.getElementById("password-log");
const loginSubmitBtn = document.getElementById("login-submit-btn");

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
  const firebaseConfig = {
    apiKey: "AIzaSyDBcy0uAVjrTqykSw9fNswmuuktxywCSyM",
    authDomain: "applibit-28066.firebaseapp.com",
    projectId: "applibit-28066",
    storageBucket: "applibit-28066.firebasestorage.app",
    messagingSenderId: "787697335155",
    appId: "1:787697335155:web:94e4658593b2d44ad56306",
  };

  try {
    window.lock?.();

    const cred = await createUserWithEmailAndPassword(auth, email, pwd);
    if (uname) await updateProfile(cred.user, { displayName: uname });
    await sendEmailVerification(cred.user);
    setFeedback(emailInput, "Verification email sent. Check your inbox.");
  } catch (err) {
    console.error("signup error:", err);
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

export { app, auth };
