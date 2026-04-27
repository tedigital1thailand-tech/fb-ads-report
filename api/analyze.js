export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { adsData, clientName, datePreset, anthropicKey } = req.body;
    const ANTHROPIC_API_KEY = anthropicKey || process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Missing Anthropic API Key' });
    const prompt = `คุณเป็น Facebook Ads Expert วิเคราะห์ผลโฆษณาของ "${clientName||'ลูกค้า'}" ช่วง ${datePreset} สรุปเป็น Report ภาษาไทย

ข้อมูล: ${JSON.stringify(adsData)}

Benchmark: CTR ดี >2%, ดีมาก >3% | CPM ปกติ ฿30-80 | CPC ดี <฿5

สรุป 4 ส่วน:
## 📊 ภาพรวมประสิทธิภาพ
## ✅ จุดเด่น
## ⚠️ จุดที่ต้องปรับปรุง
## 💡 คำแนะนำเร่งด่วน`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(400).json({ error: 'Claude API: ' + data.error.message });
    return res.status(200).json({ analysis: data.content?.[0]?.text || 'ไม่สามารถวิเคราะห์ได้' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
