const BINO_NUMBER = '919800081110';
let generatedMessage = '';
let selectedCategory = '';

// ─── Chip selection ───
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedCategory = chip.dataset.val;
  });
});

// ─── Fill from example card ───
function fillExample(card) {
  document.getElementById('needInput').value = card.querySelector('.example-text').textContent;
  document.getElementById('needInput').focus();
}

// ─── Main generate function ───
async function generateQuery() {
  const need   = document.getElementById('needInput').value.trim();
  const city   = document.getElementById('cityInput').value.trim();
  const budget = document.getElementById('budgetInput').value.trim();

  if (!need) {
    const ta = document.getElementById('needInput');
    ta.focus();
    ta.style.borderColor = '#c0535f';
    setTimeout(() => ta.style.borderColor = '', 1000);
    return;
  }

  const btn = document.getElementById('generateBtn');
  btn.classList.add('loading');
  btn.textContent = 'Crafting…';

  const outputCard = document.getElementById('outputCard');
  const messageBox = document.getElementById('messageBox');
  outputCard.classList.add('visible');
  messageBox.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';

  const systemPrompt = `You are a message crafter for Bino, a WhatsApp-based AI search service that connects users with local businesses and services.

Your job: take the user's requirement and write a clear, natural, friendly WhatsApp message they can send to Bino to get results.

Rules:
- Keep it under 3 short lines
- Be specific and direct — include key details (urgency, quantity, location, budget if given)
- Use conversational, natural language — like texting a helpful friend
- Do NOT use hashtags, excessive emojis, or marketing language
- Do NOT start with "Hi" or "Hello"
- Output ONLY the message text, nothing else`;

  const userPrompt = `Need: ${need}${city ? `\nCity/Location: ${city}` : ''}${budget ? `\nBudget: ${budget}` : ''}${selectedCategory ? `\nCategory: ${selectedCategory}` : ''}\n\nWrite the Bino WhatsApp message.`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userPrompt })
    });

    const data = await response.json();
    const text = data.text || '';

    if (!text) throw new Error('Empty response');

    generatedMessage = text;
    messageBox.textContent = text;
    document.getElementById('waLink').href = `https://wa.me/${BINO_NUMBER}?text=${encodeURIComponent(text)}`;
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    console.error(err);
    messageBox.textContent = 'Something went wrong. Please try again.';
  }

  btn.classList.remove('loading');
  btn.textContent = '✦ Craft My Bino Message';
}

// ─── Copy to clipboard ───
function copyMessage() {
  if (!generatedMessage) return;
  navigator.clipboard.writeText(generatedMessage).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1800);
  });
}

// ─── Keyboard shortcut: Cmd/Ctrl + Enter ───
document.getElementById('needInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generateQuery();
});