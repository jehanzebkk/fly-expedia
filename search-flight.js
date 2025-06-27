
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const token = 'c490a24d18eb40843f0d31a9cfa29251';
    const { origin, destination, date, trip, returndate } = event.queryStringParameters;

    if (!origin || !destination || !date) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing required parameters.' }) };
    }

    try {
        const params = new URLSearchParams({
            origin,
            destination,
            departure_at: date,
            token,
            currency: 'usd',
            limit: '10'
        });
        const response = await fetch(`https://api.travelpayouts.com/v2/prices/latest?${params}`);
        const data = await response.json();

        const outboundFlights = data.data.map(flight => ({
            origin: flight.origin,
            destination: flight.destination,
            departure_at: flight.departure_at,
            return_at: flight.return_at,
            price: flight.price,
            airline: flight.airline
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({
                outbound: outboundFlights,
                return: trip === 'roundtrip' ? outboundFlights : []
            })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
