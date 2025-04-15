importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCMiudsDlmwkmt6RGxaJGfG0iIWkhwmsMg",
  authDomain: "fcm-test-884f0.firebaseapp.com",
  projectId: "fcm-test-884f0",
  storageBucket: "fcm-test-884f0.firebasestorage.app",
  messagingSenderId: "999002517986",
  appId: "1:999002517986:web:47ef484dabe345c50889bb",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: "/logo192.png",
  };

  self.registration.showNotification(title, notificationOptions);
});
