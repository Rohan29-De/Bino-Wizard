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

  const { userNeed, city, budget, category } = req.body;

  if (!userNeed) {
    res.status(400).json({ error: 'Missing userNeed' });
    return;
  }

  const systemPrompt = `You are an expert at crafting WhatsApp search messages for Bino — an AI-powered service that contacts local businesses on your behalf and gets you real quotes, options, and deals.

Bino works best when messages are specific, action-oriented, and give businesses enough detail to send a useful offer back. A vague message gets vague results.

Your job: transform the user's raw need into a sharp, specific WhatsApp message that will get Bino the best possible responses from businesses.

RULES:
- Write 2-3 lines MAX
- Add smart specifics the user didn't mention but would obviously want: check-in/check-out framing, "with AC", "vegetarian options", "door-to-door", "certified mechanic", etc — based on context
- Use natural conversational tone, like a savvy local texting a friend who knows everyone
- Include a soft call-to-action: "send me options", "get me 3 quotes", "what's available", "looking to book today", etc.
- Never start with "Hi" or "Hello"
- Never use hashtags or excessive punctuation
- Output ONLY the message — no explanation, no quotes around it, nothing else

BAD example (too vague, just a restatement):
"Need a budget hotel in Goa near beach for 2 nights, 2 adults, budget ₹5000"

GOOD example (specific, actionable, gets real responses):
"Looking for a clean budget hotel in North Goa — walking distance or 5 min from a beach, 2 adults, check-in this weekend for 2 nights. AC room, under ₹2500/night. Send me a few options with prices?"`;

  const userPrompt = `User need: ${userNeed}
${city ? `Location: ${city}` : ''}
${budget ? `Budget: ${budget}` : ''}
${category ? `Category: ${category}` : ''}

Write the Bino WhatsApp message.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
        temperature: 0.8,
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