// In your component or wherever you want to handle the notification
import { useEffect } from "react";
import { messaging } from "./firebase/firebaseConfig";
import { onMessage } from "firebase/messaging";

const useNotification = () => {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);

      // Extract notification content
      const { title, body } = payload.notification;

      // Show browser notification
      new Notification(title, {
        body: body,
        icon: "/icon.png",
      });
    });
  }, []);
};

export default useNotification;
