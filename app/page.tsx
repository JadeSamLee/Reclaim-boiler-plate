'use client'
import { useState } from 'react';
import QRCode from "react-qr-code";
import { Reclaim } from '@reclaimprotocol/js-sdk';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');

  const APP_ID = " "; // application ID
  const APP_SECRET = " "; // APP_SECRET
  const reclaimClient = new Reclaim.ProofRequest(APP_ID);

  async function generateVerificationRequest() {
    try {
      const providerId = '39c31ffd-0be0-4e45-9a18-1eb3cb8099e1'; //provider ID

      //context to the proof request
      reclaimClient.addContext(`user's address`, 'for acmecorp.com on 1st January');

      // Build the proof request
      await reclaimClient.buildProofRequest(providerId);

      // Generate the signature
      const signature = await reclaimClient.generateSignature(APP_SECRET);
      reclaimClient.setSignature(signature);

      // Create the verification request
      const { requestUrl, statusUrl } = await reclaimClient.createVerificationRequest();
      setUrl(requestUrl);

      // Start the session with retry logic
      const startSession = async () => {
        try {
          await reclaimClient.startSession({
            onSuccessCallback: proofs => {
              console.log('Verification success', proofs);
              setVerificationMessage('Verification succeeded.');
            },
            onFailureCallback: error => {
              console.error('Verification failed', error);
              setVerificationMessage('Verification failed. Please try again.');
              setError('Verification failed. Please try again.');
            }
          });
        } catch (err) {
          console.error('Error starting session', err);
          setVerificationMessage('An error occurred. Please try again.');
          setError('An error occurred. Please try again.');
        }
      };

      startSession();

    } catch (err) {
      console.error('Error generating verification request', err);
      setVerificationMessage('An error occurred. Please try again.');
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div>
      {!url && !error && !verificationMessage && (
        <button onClick={generateVerificationRequest}>
          Create Claim QR Code
        </button>
      )}
      {url && (
        <div>
          <QRCode value={url} />
        </div>
      )}
      {error && (
        <div>
          {error}
        </div>
      )}
      {verificationMessage && (
        <div>
          {verificationMessage}
        </div>
      )}
    </div>
  );
}
