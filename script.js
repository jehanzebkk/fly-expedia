
document.getElementById('trip-type').addEventListener('change', function() {
    const returnDate = document.getElementById('return-date');
    if (this.value === 'roundtrip') {
        returnDate.style.display = 'block';
        returnDate.required = true;
    } else {
        returnDate.style.display = 'none';
        returnDate.required = false;
    }
});

// Load IATA mapping (simple city to code mapping)
const iataMap = {
    'lahore': 'LHE',
    'dubai': 'DXB',
    'karachi': 'KHI',
    'islamabad': 'ISB',
    'jeddah': 'JED',
    'doha': 'DOH'
};

document.getElementById('flight-search-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const tripType = document.getElementById('trip-type').value;
    const originInput = document.getElementById('origin').value.trim().toLowerCase();
    const destinationInput = document.getElementById('destination').value.trim().toLowerCase();
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;

    const origin = iataMap[originInput] || originInput.toUpperCase();
    const destination = iataMap[destinationInput] || destinationInput.toUpperCase();

    document.getElementById('results').innerHTML = 'Loading...';

    let url = `/.netlify/functions/search-flight?origin=${origin}&destination=${destination}&date=${departureDate}&trip=${tripType}`;
    if (tripType === 'roundtrip') {
        url += `&returndate=${returnDate}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            document.getElementById('results').innerHTML = 'Error: ' + data.error;
        } else {
            let html = '<h3>Available Flights:</h3>';
            if (data.outbound && data.outbound.length > 0) {
                html += '<h4>Outbound Flights:</h4><ul>';
                data.outbound.forEach(flight => {
                    const link = `https://www.aviasales.com/search/${origin}${departureDate.replace(/-/g,'').slice(4,8)}${destination}1?marker=456072`;
                    html += `<li>${flight.origin} ➔ ${flight.destination} | ${flight.departure_at} | Price: $${flight.price} <a href="${link}" target="_blank">Book Now</a></li>`;
                });
                html += '</ul>';
            }
            if (tripType === 'roundtrip' && data.return && data.return.length > 0) {
                html += '<h4>Return Flights:</h4><ul>';
                data.return.forEach(flight => {
                    const link = `https://www.aviasales.com/search/${destination}${returnDate.replace(/-/g,'').slice(4,8)}${origin}1?marker=456072`;
                    html += `<li>${flight.origin} ➔ ${flight.destination} | ${flight.departure_at} | Price: $${flight.price} <a href="${link}" target="_blank">Book Now</a></li>`;
                });
                html += '</ul>';
            }
            document.getElementById('results').innerHTML = html;
        }
    } catch (error) {
        document.getElementById('results').innerHTML = 'Error fetching flights.';
    }
});
