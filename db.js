import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { app } from "./auth.js";

export const db = getFirestore(app);
