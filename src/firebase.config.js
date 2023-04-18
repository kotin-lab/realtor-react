// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCClX4M2SW-1e08mh-57xCdMMSiqeg5KRU",
  authDomain: "realtor-react-fbafa.firebaseapp.com",
  projectId: "realtor-react-fbafa",
  storageBucket: "realtor-react-fbafa.appspot.com",
  messagingSenderId: "679553395306",
  appId: "1:679553395306:web:e2da99d79927cc0fb23813"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();