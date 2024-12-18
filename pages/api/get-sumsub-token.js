import crypto from 'crypto';

const API_KEY = process.env.SUMSUB_TOKEN|| ''; 
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const externalUserId = req.query.externalUserId || `user-${Date.now()}`; 
  const levelName = 'basic-kyc-level'; 
  const ts = Math.floor(Date.now() / 1000); 

  const path = `/resources/applicants?levelName=${levelName}`;
  const body = { externalUserId };

  try {
    console.log('Generating request signature...');
    const signature = createSignature('POST', path, ts, body);
    console.log('Generated Signature:', signature);


    const applicantResponse = await fetch(`https://api.sumsub.com${path}`, {
      method: 'POST',
      headers: {
        'X-App-Token': API_KEY,
        'X-App-Access-Sig': signature,
        'X-App-Access-Ts': ts.toString(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!applicantResponse.ok) {
      const errorData = await applicantResponse.json();
      console.error('Sumsub API Error (Applicant Creation):', errorData);
      return res.status(applicantResponse.status).json({ error: errorData });
    }

    const applicantData = await applicantResponse.json();
    console.log('Applicant Created:', applicantData);


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
      console.error('Sumsub API Error (Token Generation):', errorData);
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
