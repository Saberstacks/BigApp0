document.addEventListener('DOMContentLoaded', () => {
  const featureList = document.getElementById('feature-list');
  const form = document.getElementById('feature-form');
  const input = document.getElementById('feature-input');
  const results = document.getElementById('results');
  const errorMessage = document.createElement('p');
  const exampleBox = document.createElement('div');

  errorMessage.style.color = 'red';
  errorMessage.style.display = 'none';
  exampleBox.style.color = 'green';
  exampleBox.style.marginTop = '10px';
  form.appendChild(errorMessage);
  form.appendChild(exampleBox);

  let currentFeature = '';

  featureList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      currentFeature = e.target.dataset.feature;

      switch (currentFeature) {
        case 'google-business':
          input.placeholder = 'Enter your business name (e.g., My Awesome Business)';
          exampleBox.textContent = 'Example: My Awesome Business';
          break;
        case 'on-page-seo':
          input.placeholder = 'Enter a valid website URL (e.g., https://example.com)';
          exampleBox.textContent = 'Example: https://example.com';
          break;
        case 'competitor-analysis':
          input.placeholder = 'Enter target and competitor domains (comma-separated)';
          exampleBox.textContent = 'Example: target.com, competitor.com';
          break;
        case 'keyword-research':
          input.placeholder = 'Enter keywords separated by commas (e.g., keyword1, keyword2)';
          exampleBox.textContent = 'Example: keyword1, keyword2';
          break;
        case 'backlink-tracking':
          input.placeholder = 'Enter a valid website URL (e.g., https://example.com)';
          exampleBox.textContent = 'Example: https://example.com';
          break;
      }

      errorMessage.style.display = 'none';
      results.innerHTML = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = input.value.trim();

    if (!currentFeature || !userInput) {
      errorMessage.textContent = 'Please fill in the required fields before submitting.';
      errorMessage.style.display = 'block';
      return;
    }

    let payload;
    try {
      switch (currentFeature) {
        case 'google-business':
          payload = { businessName: userInput };
          break;
        case 'on-page-seo':
          if (!userInput.startsWith('http')) throw new Error('Invalid URL format.');
          payload = { site: userInput };
          break;
        case 'competitor-analysis':
          const [target, competitor] = userInput.split(',').map((item) => item.trim());
          if (!target || !competitor) throw new Error('Both target and competitor domains are required.');
          payload = { target, competitor };
          break;
        case 'keyword-research':
          const keywords = userInput.split(',').map((item) => item.trim());
          if (keywords.length === 0) throw new Error('At least one keyword is required.');
          payload = { keywords };
          break;
        case 'backlink-tracking':
          if (!userInput.startsWith('http')) throw new Error('Invalid URL format.');
          payload = { site: userInput };
          break;
      }

      const response = await fetch(`/api/seo/${currentFeature}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      results.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
    }
  });
});
