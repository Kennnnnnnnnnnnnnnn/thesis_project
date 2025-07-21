// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOZd4U9dE8kEjhRatLaTbGckVQoLnhIbc",
  authDomain: "my-thesis-project-a45fb.firebaseapp.com",
  projectId: "my-thesis-project-a45fb",
  storageBucket: "my-thesis-project-a45fb.firebasestorage.app",
  messagingSenderId: "385534795552",
  appId: "1:385534795552:web:094bbdf96b16c860e28145"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);