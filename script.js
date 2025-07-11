Promise.all([
  fetch('items.json').then(res => res.json()),
  fetch('https://raw.githubusercontent.com/PekoraTrading/Values-Demand/main/Collectibles.json').then(res => res.json())
]).then(([items, values]) => {
  const container = document.getElementById('items-container');
  const valueContainer = document.getElementById('value-items-container');
  const totalItemsElement = document.getElementById('total-items');
  const mostRapElement = document.getElementById('most-rap');
  const lowestRapElement = document.getElementById('lowest-rap');

  totalItemsElement.textContent = items.length;
  container.innerHTML = '';
  valueContainer.innerHTML = '';

  let maxRap = 0;
  let minRap = Infinity;
  let mostRapItem = null;
  let lowestRapItem = null;

  const isValued = (name) => values.find(v => v.Name === name);

  items.forEach(item => {
    let rapValue = parseInt(item.rap?.replace(/\D/g, '') || '0', 10);
    if (rapValue > maxRap) {
      maxRap = rapValue;
      mostRapItem = item;
    }
    if (rapValue > 0 && rapValue < minRap) {
      minRap = rapValue;
      lowestRapItem = item;
    }

    const card = document.createElement('div');
    card.className = 'item-card';

    const valueEntry = isValued(item.name);

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h2>${item.name}</h2>
      ${valueEntry ? `
        <div class="value-badge">💰 ${valueEntry.Value}</div>
        <div class="demand-badge">${valueEntry.Demand}</div>
      ` : ''}
      <p><strong>Price:</strong> ${item.price}</p>
      ${item.sold ? `<p><strong>Sold:</strong> ${item.sold}</p>` : ''}
      ${item.original_price ? `<p><strong>OG Price:</strong> ${item.original_price}</p>` : ''}
      ${item.rap ? `<p><strong>RAP:</strong> ${item.rap}</p>` : ''}
      <a href="${item.link}" target="_blank">View</a>
    `;

    if (valueEntry) {
      valueContainer.appendChild(card.cloneNode(true));
    }
    container.appendChild(card);
  });

  mostRapElement.textContent = mostRapItem ? `${mostRapItem.name} (${mostRapItem.rap})` : 'No RAP data';
  lowestRapElement.textContent = lowestRapItem ? `${lowestRapItem.name} (${lowestRapItem.rap})` : 'No RAP data';

  // Search filter
  document.getElementById('search-input').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const cards = container.querySelectorAll('.item-card');
    cards.forEach(card => {
      const title = card.querySelector('h2').textContent.toLowerCase();
      card.style.display = title.includes(search) ? '' : 'none';
    });
  });
});
