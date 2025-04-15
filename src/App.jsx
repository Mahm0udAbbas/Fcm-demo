import React, { useEffect } from "react";
import { requestFirebaseNotificationPermission } from "./firebase/fcmService";
import SendOfferButton from "./SendOfferButton";
import useNotification from "./useNotification";

function App() {
  useEffect(() => {
    requestFirebaseNotificationPermission();
  }, []);
  useNotification();

  return (
    <div>
      <h1>React + Firebase Messaging + PHP Backend </h1>
      <SendOfferButton />
    </div>
  );
}

export default App;
