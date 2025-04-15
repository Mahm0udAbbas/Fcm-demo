import React, { useEffect } from "react";
import { requestFirebaseNotificationPermission } from "./firebase/fcmService";
import SendOfferButton from "./SendOfferButton";

function App() {
  useEffect(() => {
    requestFirebaseNotificationPermission();
  }, []);

  return (
    <div>
      <h1>React + Firebase Messaging + PHP Backend </h1>
      <SendOfferButton />
    </div>
  );
}

export default App;
