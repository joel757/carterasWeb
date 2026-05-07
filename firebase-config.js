// firebase-config.js

const firebaseConfig = {
    apiKey: "AIzaSyCgrJVvTMKHH4e-EwG_gQYEzyDNtOSvlYQ",
    authDomain: "carterasweb.firebaseapp.com",
    databaseURL: "https://carterasweb-default-rtdb.firebaseio.com",
    projectId: "carterasweb",
    storageBucket: "carterasweb.firebasestorage.app",
    messagingSenderId: "232013519854",
    appId: "1:232013519854:web:03c18c604e18927d644cff",
    measurementId: "G-2JBE1SGD1N"
};

// Variable global para acceder a la base de datos
let db = null;

// Inicializamos Firebase
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "TU_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore(); // Usamos Firestore para la base de datos de carteras
    console.log("Firebase conectado correctamente.");
} else {
    console.warn("Firebase NO está configurado. Usando LocalStorage temporalmente.");
}
