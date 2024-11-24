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

  // Feature selection logic
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
        case 'backlinks':
          input.placeholder = 'Enter a valid website URL (e.g., https://example.com)';
          exampleBox.textContent = 'Example: https://example.com';
          break;
        case 'keywords-data':
          input.placeholder = 'Enter keywords separated by commas (e.g., keyword1, keyword2)';
          exampleBox.textContent = 'Example: keyword1, keyword2';
          break;
        default:
          errorMessage.textContent = 'Unknown feature selected.';
          errorMessage.style.display = 'block';
          return;
      }

      errorMessage.style.display = 'none';
      results.innerHTML = '';
    }
  });

  // Form submission logic
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
          payload = { site: userInput };
          break;
        case 'backlinks':
          payload = { site: userInput };
          break;
        case 'keywords-data':
          const keywords = userInput.split(',').map((item) => item.trim());
          payload = { keywords, location_code: 2840, language_name: 'English' };
          break;
        default:
          throw new Error('Unknown feature selected.');
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
