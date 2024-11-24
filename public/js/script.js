document.addEventListener('DOMContentLoaded', () => {
  const featureList = document.getElementById('feature-list');
  const form = document.getElementById('feature-form');
  const input = document.getElementById('feature-input');
  const results = document.getElementById('results');

  let currentFeature = '';

  featureList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      currentFeature = e.target.dataset.feature;
      input.placeholder = `Enter input for ${e.target.textContent}`;
      results.innerHTML = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = input.value;

    try {
      const response = await fetch(`/api/seo/${currentFeature}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: userInput }),
      });
      const data = await response.json();
      results.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      results.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });
});
