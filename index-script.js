import {
  onAuthStateChanged,
  reload,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { app, auth, db, firebaseConfig } from "./firebase.js";
const loginButton = document.getElementById("log-in");
const signUpButton = document.getElementById("sign-up");

const signLog = document.querySelector(".sign-log");
const signUser = document.querySelector(".sign-user");
const signPass1 = document.getElementById("sign-pass1");
const signPass2 = document.getElementById("sign-pass2");
const logUserPass = document.getElementById("login-pass-user");

const signUserCtn = document.getElementById("username-sign");

const userReq = document.getElementById("username-requirements");
const pass1 = document.getElementById("password-sign");
const passReq = document.querySelector(".password-requirements");

const progressIndicatorWrapper = document.querySelector(".progress-indicator");
const progressIndicator1 = document.getElementById("progress-step1");
const progressIndicator2 = document.getElementById("progress-step2");
const progressIndicator3 = document.getElementById("progress-step3");

const confirmPass = document.getElementById("confirm-password");
const signUpWrapper = document.querySelector(".sign-user-pass");

const emailWrapper = document.querySelector(".email-verify");

// prevent accidental form submit on Enter in step inputs
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches("input")) e.preventDefault();
});

// simple in-flight lock so clicks don't pile up
let animating = false;
function lock() {
  animating = true;
}
function unlock() {
  animating = false;
}
function isLocked() {
  return animating;
}

// --- listeners (guard + lock) ---
loginButton?.addEventListener("click", async () => {
  if (isLocked()) return;
  lock();
  await fadeOut(signLog);
  await fadeIn(logUserPass);
  unlock();
});

signUpButton?.addEventListener("click", async () => {
  if (isLocked()) return;
  lock();
  await fadeOut(signLog);
  await fadeIn(signUser);
  await fadeIn(progressIndicatorWrapper);
  unlock();
});

confirmPass?.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter" || isLocked()) return;
  event.preventDefault();
  lock();
  await fadeOut(signUpWrapper);
  await fadeIn(emailWrapper);
  await progressIndicator2.classList.remove("active");
  await progressIndicator2.classList.add("completed");
  await progressIndicator3.classList.add("active");
  unlock();
});

signUserCtn?.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter" || isLocked()) return;
  event.preventDefault();
  lock();
  await fadeOut(userReq);
  await progressIndicator1.classList.add("completed");
  await progressIndicator1.classList.remove("active");
  await progressIndicator2.classList.add("active");
  await fadeIn(signPass1);
  unlock();
});

pass1?.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter" || isLocked()) return;
  event.preventDefault();
  lock();
  await fadeOut(passReq);
  await fadeIn(signPass2);
  unlock();
});

// --- animations ---
function fadeOut(el, fallbackMs) {
  return new Promise((resolve) => {
    if (!el) return resolve();

    // ensure starting state transitions opacity
    el.classList.remove("fadein");
    el.classList.add("fadeout");

    const onEnd = (e) => {
      if (e.propertyName !== "opacity") return;
      el.removeEventListener("transitionend", onEnd);
      el.classList.add("hidden");
      el.classList.remove("fadeout");
      resolve();
    };
    el.addEventListener("transitionend", onEnd);

    // fallback if transitionend never fires (display:none parent, etc.)
    const dur = getOpacityDuration(el);
    setTimeout(() => {
      el.removeEventListener("transitionend", onEnd);
      el.classList.add("hidden");
      el.classList.remove("fadeout");
      resolve();
    }, (fallbackMs ?? dur) + 50);
  });
}

function fadeIn(el, fallbackMs) {
  return new Promise((resolve) => {
    if (!el) return resolve();

    el.classList.remove("hidden");
    // force reflow so opacity transition runs
    void el.offsetWidth;

    el.classList.remove("fadeout");
    el.classList.add("fadein");

    const onEnd = (e) => {
      if (e.propertyName !== "opacity") return;
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };
    el.addEventListener("transitionend", onEnd);

    const dur = getOpacityDuration(el);
    setTimeout(() => {
      el.removeEventListener("transitionend", onEnd);
      resolve();
    }, (fallbackMs ?? dur) + 50);
  });
}

// parse computed transition-duration specific to opacity (ms)
function getOpacityDuration(el) {
  const cs = getComputedStyle(el);
  const props = cs.transitionProperty.split(",").map((s) => s.trim());
  const durs = cs.transitionDuration.split(",").map((s) => s.trim());
  const idx = props.findIndex((p) => p === "opacity" || p === "all");
  const val = durs[idx >= 0 ? idx : 0] || "0s";
  return val.endsWith("ms") ? parseFloat(val) : parseFloat(val) * 1000;
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (!user.emailVerified) {
      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          window.location.href = "./dashboard.html";
        }
      }, 3000);
    }
  }
});
