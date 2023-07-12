// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfEcHVZrGGUHL4yt7p-yu05L3_8s4N5cY",
  authDomain: "cms-engine-1344c.firebaseapp.com",
  projectId: "cms-engine-1344c",
  storageBucket: "cms-engine-1344c.appspot.com",
  messagingSenderId: "916960462589",
  appId: "1:916960462589:web:2bfa43f801276a1ea3e094"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;