export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { token, accountId, datePreset, dateFrom, dateTo, level } = req.body;
    if (!token || !accountId) return res.status(400).json({ error: 'Missing token or accountId' });

    const fields = 'campaign_name,adset_name,reach,impressions,clicks,spend,ctr,actions,action_values,purchase_roas';

    // Build params safely with URLSearchParams (handles encoding automatically)
    const params = new URLSearchParams();
    params.set('fields', fields);
    params.set('level', level || 'account');
    params.set('access_token', token);

    // FIX: custom date → use time_range only, never send date_preset
    if (datePreset === 'custom' && dateFrom && dateTo) {
      params.set('time_range', JSON.stringify({ since: dateFrom, until: dateTo }));
    } else {
      params.set('date_preset', datePreset || 'last_30d');
    }

    console.log('[insights] datePreset:', datePreset, '| dateFrom:', dateFrom, '| dateTo:', dateTo);

    const url = `https://graph.facebook.com/v25.0/${accountId}/insights?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
