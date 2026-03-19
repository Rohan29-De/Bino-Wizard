export default async function handler(req, res) {
  // ─── CORS headers ───
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { systemPrompt, userPrompt } = req.body;

  if (!systemPrompt || !userPrompt) {
    res.status(400).json({ error: 'Missing systemPrompt or userPrompt' });
    return;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt }
        ]
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';

    if (!text) {
      res.status(500).json({ error: 'Empty response from Groq' });
      return;
    }

    res.status(200).json({ text });

  } catch (err) {
    console.error('Groq API error:', err);
    res.status(500).json({ error: 'Failed to contact Groq API' });
  }
}