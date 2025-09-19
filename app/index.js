 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app); 
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBeDOgrKCWTMa19v2Fz-wuSkq5mkbfkWqU",
    authDomain: "junter-uitzendbureau.firebaseapp.com",
    projectId: "junter-uitzendbureau",
    storageBucket: "junter-uitzendbureau.firebasestorage.app",
    messagingSenderId: "204353225983",
    appId: "1:204353225983:web:2812376ecd745e42a078ca",
    measurementId: "G-B05H8SY6FF"
    };