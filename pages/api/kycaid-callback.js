import { updateApplicantStatusInFirebase, createKYCFolder } from "../../firebase/forgeServices";

export default async function handler(req, res) {
  console.log('[Callback] Received callback request:', req.body);  

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    request_id,
    type,
    form_id,
    verification_id,
    external_applicant_id,
    applicant_id,
    status,
    verified,
  } = req.body;


  if (!request_id || !type || !form_id || !verification_id || !external_applicant_id || !applicant_id || !status) {
    console.error('[Callback] Missing required fields in callback:', req.body);
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const kycData = {
      request_id,
      type,
      form_id,
      verification_id,
      external_applicant_id,
      applicant_id,
      status,
      verified,
      
    };
    await createKYCFolder(external_applicant_id, kycData );
    console.log('[Callback] Successfully created KYC folder in Firebase.');
  } catch (error) {
    console.error('[Callback] Error creating KYC folder in Firebase:', error);
    return res.status(500).json({ error: 'Failed to create KYC folder.' });
  }

  const updateData = {
    kyc: {
      kycStatus: status,
      kycApprovedAt: new Date().toISOString(),
      kycReviewAnswer: verified,
    },
  };
  
  try {
    await updateApplicantStatusInFirebase(external_applicant_id, updateData);
    console.log('[Callback] Successfully updated applicant status in Firebase.');
  } catch (error) {
    console.error('[Callback] Error updating applicant status in Firebase:', error);
    return res.status(500).json({ error: 'Failed to update applicant status.' });
  }


  if (type === 'VERIFICATION_COMPLETED') {
    console.log('[Callback] VERIFICATION_COMPLETED received for applicant:', applicant_id);


    return res.status(200).json({ message: 'Callback received successfully' });
  }


  console.error('[Callback] Unsupported callback type:', type);
  return res.status(400).json({ error: 'Unsupported callback type.' });
}
