importScripts("https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.9.4/firebase-messaging.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyADIHIZXc7QF_hVIyL03XzCutC8xoLwBQw",
//   authDomain: "tranquil-leaf-357415.firebaseapp.com",
//   projectId: "tranquil-leaf-357415",
//   storageBucket: "tranquil-leaf-357415.appspot.com",
//   messagingSenderId: "9286124344",
//   appId: "1:9286124344:web:d06b6a9a163225134237cd",
// });

// const messaging = firebase.messaging();

if (!firebase.apps.length) {
  firebase.initializeApp({
    // apiKey: "AIzaSyADIHIZXc7QF_hVIyL03XzCutC8xoLwBQw",
    // authDomain: "tranquil-leaf-357415.firebaseapp.com",
    // projectId: "tranquil-leaf-357415",
    // storageBucket: "tranquil-leaf-357415.appspot.com",
    messagingSenderId: "177773421993",
    // appId: "1:9286124344:web:d06b6a9a163225134237cd"
  });
  firebase.messaging();
  //background notifications will be received here
  firebase.messaging().setBackgroundMessageHandler((payload) => console.log('payload', payload));

  }