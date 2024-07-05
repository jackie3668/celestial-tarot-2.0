import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAB_Rfs2PneOxpuIiTj63N0wHgmqoAPj6E",
  authDomain: "celestial-tarot-57f19.firebaseapp.com",
  databaseURL: "https://celestial-tarot-57f19-default-rtdb.firebaseio.com/",
  projectId: "celestial-tarot-57f19",
  storageBucket: "celestial-tarot-57f19.appspot.com",
  messagingSenderId: "138791576960",
  appId: "1:138791576960:web:c3c90238b83d7339298d65",
  measurementId: "G-D2J0L7WCBZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { app, auth, db };
