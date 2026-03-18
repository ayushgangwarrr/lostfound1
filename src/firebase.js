import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpwmA5ObMhzfwSmM6SrtOURTDDMXFj4_I",
  authDomain: "lostfound1-be72e.firebaseapp.com",
  projectId: "lostfound1-be72e",
   appId: "1:888808513404:web:b8a4cfb3cba90d975d0ef9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();