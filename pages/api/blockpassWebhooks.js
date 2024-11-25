import { updateUserStatusInFirebase } from '../../firebase/forgeServices';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    console.log('Webhook received:', JSON.stringify(data, null, 2));

    const { event, refId, status, email, timestamp } = data; 

    try {
      switch (event) {
        case 'review.approved':
          console.log(`User with refId ${refId} has been approved.`);
          await updateUserStatusInFirebase(email, 'approved', refId, timestamp || new Date().toISOString());
          break;

        case 'review.rejected':
          console.log(`User with refId ${refId} has been rejected.`);
          await updateUserStatusInFirebase(email, 'rejected', refId);
          break;

        case 'user.created':
          console.log(`New profile created for refId ${refId}.`);
          await updateUserStatusInFirebase(email, 'created', refId);
          break;

        case 'user.readyToReview':
          console.log(`User with refId ${refId} is ready for final review.`);
          await updateUserStatusInFirebase(email, 'readyToReview', refId);
          break;

        case 'user.inReview':
          console.log(`User with refId ${refId} is now in review.`);
          await updateUserStatusInFirebase(email, 'inReview', refId);
          break;

        default:
          console.warn(`Unhandled event: ${event}`);
      }


      res.status(200).send('Webhook processed successfully');
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
