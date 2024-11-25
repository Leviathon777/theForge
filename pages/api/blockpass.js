import request from 'request';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { refId, name, dob } = req.body;

  
    const options = {
      url: 'https://kyc.blockpass.org/kyc/1.0/connect/your_clientId',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.BLOCKPASS_API_KEY}`, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refId, name, dob }),
    };

    request(options, (error, response, body) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(response.statusCode).json(JSON.parse(body));
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
