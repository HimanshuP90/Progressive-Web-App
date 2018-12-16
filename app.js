const apiKey = '72405ce7c4e743e9ad8b105b330c6fe2';
const defaultSource = 'the-washington-post';
const sourceSelector = document.querySelector('#sourceSelector');
const main = document.querySelector('main');

window.addEventListener('load', async e => {
    updateNews();
    await updateNewsSources();
    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener('change', e => {
        updateNews(e.target.value)
    });

    //make sure we have service worker in navigator

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log('service worker register')
        } catch (error) {
            console.log('service worker false')
        }
    }
});

async function updateNewsSources() {
    const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
    const json = await response.json();
    sourceSelector.innerHTML =
      json.sources
        .map(source => `<option value="${source.id}">${source.name}</option>`)
        .join('\n');
}

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v1/articles?source=${source}&sortBy=top&apiKey=${apiKey}`)
    const json = await res.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
    return `
      <div class="article">
        <a href="${article.url}">
          <h2>${article.title}</h2>
          <img src="${article.urlToImage}" alt="${article.title}">
          <p>${article.description}</p>
        </a>
      </div>
    `;
}