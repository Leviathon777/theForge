import crypto from 'crypto';

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

  // Verify signature
  if (!verifySignature(req)) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  try {
    console.log('Webhook event received:', event);

    // Handle different webhook event types
    switch (event.type) {
      case 'applicantCreated':
        console.log('Applicant Created:', event.payload);
        break;

      case 'applicantPending':
        console.log('Applicant Pending:', event.payload);
        break;

      case 'applicantReviewed':
        console.log('Applicant Reviewed:', event.payload);
        break;

      case 'applicantOnHold':
        console.log('Applicant On Hold:', event.payload);
        break;

      case 'applicantActionPending':
        console.log('Applicant Action Pending:', event.payload);
        break;

      case 'applicantActionReviewed':
        console.log('Applicant Action Reviewed:', event.payload);
        break;

      case 'applicantWorkflowCompleted':
        console.log('Applicant Workflow Completed:', event.payload);
        break;

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
