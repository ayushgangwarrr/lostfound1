import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKr4KFAbzMcqYMF91_HG6bMbQUCYtb7KY",
  authDomain: "ayuapp-26299.firebaseapp.com",
  projectId: "ayuapp-26299",
  appId: "1:1042863424266:web:975550bf273e5ca25230f3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();