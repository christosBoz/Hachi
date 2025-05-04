// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWGcZsfYvSX6hMLt6PggCOWGNE51a5d9o",
  authDomain: "hachi-e3d58.firebaseapp.com",
  projectId: "hachi-e3d58",
  storageBucket: "hachi-e3d58.firebasestorage.app",
  messagingSenderId: "270451531821",
  appId: "1:270451531821:web:69186f3c2bf901f09258a4",
  measurementId: "G-4YZPH64W2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);