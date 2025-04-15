import { messaging } from "./firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

export const requestFirebaseNotificationPermission = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("✅ Service Worker registered");

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("🔐 FCM Token:", token);

      // Send token to backend via fetch
      await fetch("http://localhost/backend/save_token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          user_id: 123, // Replace with real user
        }),
      });
    } else {
      console.warn("⚠️ No registration token available");
    }

    // Foreground message handling
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground message:", payload);
      const { title, body } = payload.notification;

      new Notification(title, {
        body,
        icon: "/icon.png",
      });
    });
  } catch (err) {
    console.error("❌ Error with FCM setup:", err);
  }
};
