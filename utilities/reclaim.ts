import { Reclaim } from '@reclaimprotocol/js-sdk';

const APP_ID = "0x2efD05266b5361060b42e69D6AC8Ed71E5aAE345";
const APP_SECRET = "0x334ac8f828b97c5e71522748dcaf134d9e979c7bf2cdb61b34caa3707b85a9b6";
const providerId = '285a345c-c6a6-4b9f-9e1e-23432082c0a8';

const reclaimClient = new Reclaim.ProofRequest(APP_ID);

export async function generateVerificationRequest(providerId: string) {
  try {
    console.log('Adding context...');
    reclaimClient.addContext(
      'user\'s address',
      'for acmecorp.com on 1st January'
    );

    console.log('Generating signature...');
    const signature = await reclaimClient.generateSignature(APP_SECRET);
    console.log('Signature generated:', signature);

    reclaimClient.setSignature(signature);
    console.log('Signature set in the client.');

    console.log('Creating verification request...');
    const { requestUrl, statusUrl } = await reclaimClient.createVerificationRequest();
    console.log('Verification request created. Request URL:', requestUrl);

    return requestUrl;
  } catch (error) {
    console.error('Error in generateVerificationRequest:', error);
    throw new Error('Failed to generate verification request.');
  }
}

export async function startVerificationSession() {
  try {
    console.log('Starting verification session...');
    await reclaimClient.startSession({
      onSuccessCallback: proofs => {
        console.log('Verification success', proofs);
      },
      onFailureCallback: error => {
        console.error('Verification failed', error);
      }
    });
    console.log('Verification session started.');
  } catch (error) {
    console.error('Error in startVerificationSession:', error);
    throw new Error('Failed to start verification session.');
  }
}
