import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVWPzJ37_barsVpZkk53rzHUY1ffCjpQQ",
  authDomain: "apexstudy-a762a.firebaseapp.com",
  projectId: "apexstudy-a762a",
  storageBucket: "apexstudy-a762a.firebasestorage.app",
  messagingSenderId: "470039488570",
  appId: "1:470039488570:web:c861c786b7db94b1772d03"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// AQUI ESTÁ O PONTO CHAVE: a palavra 'export' tem que estar exatamente assim!
export const auth = getAuth(app);