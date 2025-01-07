import crypto from 'crypto';

const API_KEY = process.env.SUMSUB_TOKEN || '';
const SECRET_KEY = process.env.SUMSUB_SECRET_KEY || '';

if (!API_KEY || !SECRET_KEY) {
  console.error('Missing Sumsub API Key or Secret Key. Check your environment variables.');
  process.exit(1);
}

const createSignature = (method, path, ts, body) => {
  const data = `${ts}${method.toUpperCase()}${path}${body ? JSON.stringify(body) : ''}`;
  return crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    externalUserId,
    email,   
  } = req.body;

  const levelName = 'basic-kyc-level';
  const ts = Math.floor(Date.now() / 1000);

  try {
    // Check if the applicant already exists
    const checkPath = `/resources/applicants/-;externalUserId=${externalUserId}`;
    const checkSignature = createSignature('GET', checkPath, ts, null);

    const checkResponse = await fetch(`https://api.sumsub.com${checkPath}`, {
      method: 'GET',
      headers: {
        'X-App-Token': API_KEY,
        'X-App-Access-Sig': checkSignature,
        'X-App-Access-Ts': ts.toString(),
        
      },
    });

    if (checkResponse.ok) {
      console.log(`Applicant already exists for externalUserId: ${externalUserId}`);
    } else if (checkResponse.status === 404) {
      console.log('No existing applicant found. Proceeding to create a new one.');

      const createPath = `/resources/applicants?levelName=${levelName}`;
      const body = {
        externalUserId,
        email,
      };

      const createSignature = createSignature('POST', createPath, ts, body);

      const createResponse = await fetch(`https://api.sumsub.com${createPath}`, {
        method: 'POST',
        headers: {
          'X-App-Token': API_KEY,
          'X-App-Access-Sig': createSignature,
          'X-App-Access-Ts': ts.toString(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('Sumsub Applicant Creation Error:', errorData);
        return res.status(createResponse.status).json({ error: errorData });
      }

      console.log('Applicant created successfully.');
    } else {
      const errorData = await checkResponse.json();
      console.error('Error checking existing applicant:', errorData);
      return res.status(checkResponse.status).json({ error: errorData });
    }

    // Generate Access Token
    const tokenPath = `/resources/accessTokens?userId=${externalUserId}&levelName=${levelName}`;
    const tokenSignature = createSignature('POST', tokenPath, ts, null);

    const tokenResponse = await fetch(`https://api.sumsub.com${tokenPath}`, {
      method: 'POST',
      headers: {
        'X-App-Token': API_KEY,
        'X-App-Access-Sig': tokenSignature,
        'X-App-Access-Ts': ts.toString(),
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Sumsub Token Generation Error:', errorData);
      return res.status(tokenResponse.status).json({ error: errorData });
    }

    const tokenData = await tokenResponse.json();
    console.log('Generated Access Token:', tokenData.token);

    res.status(200).json({ token: tokenData.token });
  } catch (error) {
    console.error('Unexpected Error:', error.message);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
}
