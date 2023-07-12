// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4fmKh0rJ2htOxiI30EsAtpAv4-BiDmss",
  authDomain: "employees-6ce89.firebaseapp.com",
  projectId: "employees-6ce89",
  storageBucket: "employees-6ce89.appspot.com",
  messagingSenderId: "700964097174",
  appId: "1:700964097174:web:0840bfb352ddd42a5646b7"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;