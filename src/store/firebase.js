import "firebase/messaging";
import firebase from "firebase/app";
import localforage from "localforage";

const firebaseCloudMessaging = {
  init: async () => {
    if (!firebase?.apps?.length) {

      // Initialize the Firebase app with the credentials
      firebase?.initializeApp({
        apiKey: "AIzaSyADIHIZXc7QF_hVIyL03XzCutC8xoLwBQw",
        authDomain: "tranquil-leaf-357415.firebaseapp.com",
        projectId: "tranquil-leaf-357415",
        storageBucket: "tranquil-leaf-357415.appspot.com",
        messagingSenderId: "9286124344",
        appId: "1:9286124344:web:d06b6a9a163225134237cd",
      });

      try {
        const messaging = firebase.messaging();
        const tokenInLocalForage = await localforage.getItem("fcm_token");

         // Return the token if it is alredy in our local storage
        if (tokenInLocalForage !== null) {
          return tokenInLocalForage;
        }

        // Request the push notification permission from browser
        const status = await Notification.requestPermission();
        if (status && status === "granted") {
        // Get new token from Firebase
          const fcm_token = await messaging.getToken({
            vapidKey: "BO_HYQ9KGcZiCw0GZUQ_wm4EDllagMVjJPhPZ1ufV_SXY8cBN1-ypmTw5SGJIjtzj2o3-Z4dBUiKHAxpSnzqCjY",
          });

          // Set token in our local storage
          if (fcm_token) {
            localforage.setItem("fcm_token", fcm_token);
            return fcm_token;
          }
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};
export { firebaseCloudMessaging };