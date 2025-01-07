import crypto from 'crypto';
import { updateApplicantStatusInFirebase } from '../../firebase/forgeServices'; // Import your Firebase service

const SECRET_KEY = process.env.SUMSUB_WEBHOOK_SECRET_KEY;

const verifySignature = (req) => {
  const signature = req.headers['x-payload-digest'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(body)
    .digest('hex');

  return signature === expectedSignature;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifySignature(req)) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  try {
    console.log('Webhook event received:', event);

    switch (event.type) {
      case 'applicantReviewed': {
        const {
          reviewResult: { reviewAnswer },
          reviewStatus,
          applicantId,
          reviewDate,
        } = event.payload;
      
        console.log('Applicant Reviewed:', { reviewAnswer, reviewStatus, applicantId, reviewDate });
      
        const walletAddress = applicantId; // Matches the externalUserId used when creating the applicant
        const isApproved = reviewAnswer === 'GREEN';
        const isRejected = reviewAnswer === 'RED';
      
        // Prepare the KYC update fields
        const updateData = {
          kycStatus: isApproved ? 'approved' : isRejected ? 'rejected' : 'under review',
          kycSubmittedAt: reviewDate || null, // Submission date if provided
          kycApprovedAt: isApproved ? reviewDate : null, // Approval date only if approved
        };
      
        try {
          // Call the updateForger function to update the user's document
          const updateResult = await updateApplicantStatusInFirebase(walletAddress, updateData);
      
          console.log(`Forger with wallet address ${walletAddress} updated successfully.`);
          console.log('Firebase Update Result:', updateResult);
      
          res.status(200).json({ success: true, message: 'KYC status updated successfully.' });
        } catch (error) {
          console.error('Error updating Firebase with applicant review status:', error);
          res.status(500).json({ error: 'Error updating KYC status', details: error.message });
        }
        break;
      }
        

      default:
        console.log('Unhandled webhook type:', event.type);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
