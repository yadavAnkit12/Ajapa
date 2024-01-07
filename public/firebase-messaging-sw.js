// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

// const firebaseConfig = {
//     apiKey: "AIzaSyB7tlAFxbocpKOq17useSP_XlPX-tdhKUQ",
//     authDomain: "sample-services-61e53.firebaseapp.com",
//     projectId: "sample-services-61e53",
//     storageBucket: "sample-services-61e53.appspot.com",
//     messagingSenderId: "273649586320",
//     appId: "1:273649586320:web:87d6e0d261c719f6acc815",
//     measurementId: "G-6DS3EYXFE2"
//   };

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });