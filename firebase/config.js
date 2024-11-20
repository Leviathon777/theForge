import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAG9y4g27DrenxkajIzYWyOC7Z-ziFIp_Q",
  authDomain: "the-forge-3e527.firebaseapp.com",
  projectId: "the-forge-3e527",
  storageBucket: "the-forge-3e527.firebasestorage.app",
  messagingSenderId: "620637731837",
  appId: "1:620637731837:web:b56eb8178f9dc7a343b794",
  measurementId: "G-PXTZ8WN70Q"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { firebaseApp, db };
