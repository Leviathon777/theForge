import { updateApplicantStatusInFirebase, createKYCFolder } from "../../firebase/forgeServices";

export default async function handler(req, res) {
  console.log('[Callback] Received request:', req.body);

  if (req.method !== 'POST') {
    console.error('[Callback] Invalid HTTP method:', req.method);
    return res.status(405).json({ error: 'BOOOOOOOOOOOOOOOOOOOOOOO' });
  }

  const {
    request_id,
    type,    
    applicant_id,
    external_applicant_id,
    verification_id,
    form_id,    
    verification_status,
    verification_attempts_left,
  } = req.body;

  // Log payload for debugging
  console.log('[Callback] Full Payload:', req.body);

  // Validate required fields
  if (!type || !applicant_id) {
    console.error('[Callback] Missing critical fields:', req.body);
    return res.status(400).json({ error: 'Missing required fields in payload.' });
  }

  console.log('[Callback] Processing event type:', type);

  try {
    const kycData = {
      type,
      verification_status,
      applicant_id,
      external_applicant_id,
      form_id,
      form_token,
      verification_id,
      verification_attempts_left,
      request_id,
    };

    // Create KYC folder in Firebase
    await createKYCFolder(external_applicant_id || applicant_id, kycData);
    console.log('[Callback] Successfully created KYC folder for:', applicant_id);

    // Update Applicant Status in Firebase
    const updateData = {
      kyc: {
        kycStatus: verification_status || 'unknown',
        kycSubmittedAt: new Date().toISOString(),
      },
    };
    await updateApplicantStatusInFirebase(external_applicant_id || applicant_id, updateData);
    console.log('[Callback] Successfully updated Firebase for:', applicant_id);

    if (type === 'VERIFICATION_STATUS_CHANGED') {
      console.log('[Callback] VERIFICATION_STATUS_CHANGED processed successfully.');
      return res.status(200).json({ message: 'Callback processed successfully.' });
    }

    console.warn('[Callback] Unhandled callback type:', type);
    return res.status(200).json({ message: 'Callback processed with no explicit handling.' });
  } catch (error) {
    console.error('[Callback] Error processing callback:', error.message);
    return res.status(500).json({ error: 'Failed to process callback.', details: error.message });
  }
}
