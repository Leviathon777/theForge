import { updateApplicantStatusInFirebase, createKYCFolder } from "../../firebase/forgeServices";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    type,
    request_id,
    verification_id,
    applicant_id,
    form_id,
    form_token,
    status,
    verified,
    comment,
    verifications,
    applicant,
    external_applicant_id, 
    verification_status,
    verification_statuses,
    verification_attempts_left,
  } = req.body;

  const resolvedExternalApplicantId = external_applicant_id || (applicant ? applicant.external_applicant_id : null);


  try {
    if (type === 'VERIFICATION_STATUS_CHANGED') {
      const kycData = {
        request_id,
        type,
        form_id,
        form_token,
        verification_id,
        applicant_id,
        external_applicant_id,
        verification_status,
        verification_attempts_left,
      };

      const updateData = {
        kyc: {
          kycStatus: verification_status || 'unknown',
          kycSubmittedAt: new Date().toISOString(),
        },
      };
      await updateApplicantStatusInFirebase(external_applicant_id || applicant_id, updateData);
      return res.status(200).json({ message: 'Callback processed successfully.' });
    }

    if (type === 'VERIFICATION_COMPLETED') {
      const kycData = {
        request_id,
        type,
        form_id,
        form_token,
        verification_id,
        applicant_id,
        status,
        comment,
        verified,
        verifications,
        applicant,
        external_applicant_id: resolvedExternalApplicantId,
        verification_statuses,
        verification_attempts_left,
      };

      await createKYCFolder(resolvedExternalApplicantId, kycData);

      const updateData = {
        kyc: {
          kycStatus: status,
          kycVerified: verified,
          kycCompletedAt: status === 'completed' ? new Date().toISOString() : null,
        },
      };
      await updateApplicantStatusInFirebase(resolvedExternalApplicantId || applicant_id, updateData);
      return res.status(200).json({ message: 'Callback processed successfully.' });
    }
    console.warn('[Callback] Unhandled callback type:', type);
    return res.status(400).json({ message: 'Unsupported callback type.' });
  } catch (error) {
    console.error('[Callback] Error processing callback:', error.message);
    return res.status(500).json({ error: 'Failed to process callback.', details: error.message });
  }
}
