const searchForm = document.querySelector('.search-form');
const productList = document.querySelector('.product-list');
const priceChart = document.querySelector('.price-chart');
let myChart = null;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const inputValue = event.target[0].value;
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`);
  const products = (await response.json()).results.slice(0, 10);
  displayItems(products);
  updatePriceChart(products);
});

function displayItems(products) {
  productList.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.thumbnail.replace(/I\\.jpg$/, 'W.jpg')}">
      <h3>${p.title}</h3>
      <p class="product-price">${p.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL'})}</p>
      <p class="product-store">Loja: ${p.seller.nickname}</p>
    </div>
  `).join('');
}

function updatePriceChart(products) {
  const ctx = priceChart.getContext('2d');
  if (myChart) myChart.destroy();
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: products.map(p => p.title.substring(0, 20) + '...'),
      datasets: [{
        label: 'Preço (R$)',
        data: products.map(p => p.price),
        backgroundColor: 'rgba(46,204,113,0.6)',
        borderColor: 'rgba(46,204,113,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => 'R$ ' + v.toLocaleString('pt-br', { minimumFractionDigits: 2 })
          }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Comparador de Preços',
          font: { size: 18 }
        }
      }
    }
  });
}
