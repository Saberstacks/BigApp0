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

  // Update input placeholder, validation, and examples dynamically
  featureList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      currentFeature = e.target.dataset.feature;

      switch (currentFeature) {
        case 'google-business':
          input.placeholder = 'Enter your business name (e.g., My Awesome Business)';
          input.type = 'text';
          exampleBox.textContent = 'Example: My Awesome Business';
          break;
        case 'on-page-seo':
          input.placeholder = 'Enter a valid website URL (e.g., https://example.com)';
          input.type = 'url';
          exampleBox.textContent = 'Example: https://example.com';
          break;
        case 'competitor-analysis':
          input.placeholder = 'Enter target and competitor domains (comma-separated)';
          input.type = 'text';
          exampleBox.textContent = 'Example: target.com, competitor.com';
          break;
        case 'keyword-research':
          input.placeholder = 'Enter keywords separated by commas (e.g., keyword1, keyword2)';
          input.type = 'text';
          exampleBox.textContent = 'Example: keyword1, keyword2';
          break;
        case 'backlink-tracking':
          input.placeholder = 'Enter a valid website URL (e.g., https://example.com)';
          input.type = 'url';
          exampleBox.textContent = 'Example: https://example.com';
          break;
        default:
          input.placeholder = 'Enter your input';
          exampleBox.textContent = '';
      }

      errorMessage.style.display = 'none';
      results.innerHTML = '';
    }
  });

  // Validate and submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = input.value.trim();

    if (!currentFeature) {
      errorMessage.textContent = 'Please select a feature before submitting.';
      errorMessage.style.display = 'block';
      return;
    }

    if (!userInput) {
      errorMessage.textContent = 'Input cannot be empty. Please provide the required information.';
      errorMessage.style.display = 'block';
      return;
    }

    // Validate based on feature
    let payload;
    switch (currentFeature) {
      case 'google-business':
        payload = { businessName: userInput };
        break;
      case 'on-page-seo':
        if (!userInput.startsWith('http')) {
          errorMessage.textContent = 'Please enter a valid URL.';
          errorMessage.style.display = 'block';
          return;
        }
        payload = { site: userInput };
        break;
      case 'competitor-analysis':
        const [target, competitor] = userInput.split(',').map((item) => item.trim());
        if (!target || !competitor) {
          errorMessage.textContent = 'Please enter both target and competitor domains, separated by a comma.';
          errorMessage.style.display = 'block';
          return;
        }
        payload = { target, competitor };
        break;
      case 'keyword-research':
        const keywords = userInput.split(',').map((item) => item.trim());
        if (keywords.length === 0) {
          errorMessage.textContent = 'Please enter at least one keyword.';
          errorMessage.style.display = 'block';
          return;
        }
        payload = { keywords };
        break;
      case 'backlink-tracking':
        if (!userInput.startsWith('http')) {
          errorMessage.textContent = 'Please enter a valid URL.';
          errorMessage.style.display = 'block';
          return;
        }
        payload = { site: userInput };
        break;
      default:
        errorMessage.textContent = 'Unknown feature selected.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
      const response = await fetch(`/api/seo/${currentFeature}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      results.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      errorMessage.style.display = 'none';
    } catch (error) {
      results.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });
});
