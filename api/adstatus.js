export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { token, accountId, level } = req.body;
    if (!token || !accountId) return res.status(400).json({ error: 'Missing params' });
    const endpoint = level === 'adset' ? 'adsets' : level === 'campaign' ? 'campaigns' : 'campaigns';
    const fields = level === 'adset' ? 'name,effective_status,adset_name' : 'name,effective_status,campaign_name';
    const url = `https://graph.facebook.com/v25.0/${accountId}/${endpoint}?fields=${fields}&limit=50&access_token=${token}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
