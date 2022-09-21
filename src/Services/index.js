
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbXmKkHMxalAibWgrhJ-G0Ns8kyjy26Dw",
  authDomain: "cuentascorrientes-fcc2e.firebaseapp.com",
  projectId: "cuentascorrientes-fcc2e",
  storageBucket: "cuentascorrientes-fcc2e.appspot.com",
  messagingSenderId: "313994449844",
  appId: "1:313994449844:web:b2670607408e1508ecd8e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)