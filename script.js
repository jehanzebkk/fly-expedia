// script.js - Adds IATA autocomplete to Fly Expedia using airports.json

let airports = [];

// Load the airports.json data for autocomplete
fetch('/airports.json')
  .then(response => response.json())
  .then(data => { airports = data; })
  .catch(err => console.error('Error loading airports.json:', err));

// Create autocomplete for origin and destination
function setupAutocomplete(inputId) {
  const input = document.getElementById(inputId);
  const dropdown = document.createElement('div');
  dropdown.classList.add('autocomplete-dropdown');
  input.parentNode.appendChild(dropdown);

  input.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    dropdown.innerHTML = '';
    if (!value || value.length < 2) return;

    const matches = airports.filter(airport =>
      airport.name.toLowerCase().includes(value) ||
      airport.city.toLowerCase().includes(value) ||
      airport.iata.toLowerCase().includes(value)
    ).slice(0, 5);

    matches.forEach(match => {
      const item = document.createElement('div');
      item.textContent = `${match.city} (${match.iata}) - ${match.country}`;
      item.classList.add('autocomplete-item');
      item.addEventListener('click', function() {
        input.value = match.iata;
        dropdown.innerHTML = '';
      });
      dropdown.appendChild(item);
    });
  });

  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target) && e.target !== input) {
      dropdown.innerHTML = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setupAutocomplete('origin');
  setupAutocomplete('destination');
});

// Style for the dropdown
const style = document.createElement('style');
style.innerHTML = `
.autocomplete-dropdown {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  z-index: 1000;
  max-height: 150px;
  overflow-y: auto;
  width: calc(100% - 22px);
}
.autocomplete-item {
  padding: 8px;
  cursor: pointer;
}
.autocomplete-item:hover {
  background: #f0f0f0;
}
`;
document.head.appendChild(style);
