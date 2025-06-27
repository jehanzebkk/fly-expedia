
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { origin, destination, date, trip, returndate } = event.queryStringParameters;
    const token = 'c490a24d18eb40843f0d31a9cfa29251';

    if (!origin || !destination || !date) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing parameters' }) };
    }

    try {
        const outboundUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&departure_at=${date}&currency=usd&direct=true&limit=5`;
        const outboundResponse = await fetch(outboundUrl, { headers: { 'X-Access-Token': token } });
        const outboundData = await outboundResponse.json();

        let returnData = [];
        if (trip === 'roundtrip' && returndate) {
            const returnUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${destination}&destination=${origin}&departure_at=${returndate}&currency=usd&direct=true&limit=5`;
            const returnResponse = await fetch(returnUrl, { headers: { 'X-Access-Token': token } });
            const returnJson = await returnResponse.json();
            if (returnJson.success) {
                returnData = returnJson.data;
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                outbound: outboundData.success ? outboundData.data : [],
                return: returnData
            })
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
