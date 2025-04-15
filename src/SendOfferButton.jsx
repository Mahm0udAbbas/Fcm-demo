import React, { useState } from 'react';

const SendOfferButton = () => {
  // State to manage the offer details
  const [offerDetails, setOfferDetails] = useState('');
  const [status, setStatus] = useState('');

  // Function to handle the offer submission
  const sendOffer = async () => {
    try {
      setStatus('Sending offer...');
      
      // Making the POST request to PHP backend
      const response = await fetch('http://localhost/backend/submit_offer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technician_id: 1, // Replace with the technician's ID dynamically
          user_id: 123,      // Replace with the actual user's ID dynamically
          offer_details: offerDetails,  // Get the offer details from the state
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setStatus('Offer sent and notification triggered!');
      } else {
        setStatus('Error sending offer');
      }
    } catch (error) {
      setStatus('Error: ' + error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={offerDetails}
        onChange={(e) => setOfferDetails(e.target.value)}
        placeholder="Enter offer details"
      />
      <button onClick={sendOffer}>Send Offer</button>
      <p>{status}</p>
    </div>
  );
};

export default SendOfferButton;
