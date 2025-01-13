export default async function handler(req, res) {
  const API_TOKEN = process.env.KYCAID_SANDBOX_API_KEY;
  const { form_id, external_applicant_id } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`https://api.kycaid.com/forms/${form_id}/urls`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_applicant_id,
        
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
