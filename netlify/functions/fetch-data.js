// File: netlify/functions/fetch-data.js

// Netlify uses Node.js, so we require the standard fetch library
const fetch = require('node-fetch');

// This is the main function Netlify runs when the endpoint /.netlify/functions/fetch-data is called
exports.handler = async (event) => {
  
  // 1. SECURE: Get the secret API key we saved in the Netlify settings
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API Key not configured in Netlify settings. Check your Environment Variables." })
    };
  }

  // 2. Get the data (like the user's prompt) sent from your frontend code
  // The frontend request body is found in event.body
  const body = JSON.parse(event.body);

  try {
    // 3. Make the secure request to the actual Gemini API endpoint
    // This URL is the standard endpoint for the gemini-2.5-flash model
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 4. Critically, we include the secret API key on the server side (not exposed to the user)
      body: JSON.stringify({
        ...body,
        key: apiKey // Attach the secret key as a query parameter in the request body
      })
    });

    // 5. Check if the request to Google's API was successful
    if (!response.ok) {
        // If Google sends an error, we read it and pass the status back to the frontend
        const errorData = await response.json();
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: `Gemini API error: ${response.statusText}`, details: errorData })
        };
    }

    // 6. If successful, get the data and send it back to your frontend code
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    // Handles any connection or unexpected errors
    console.error('Function execution error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error in Netlify Function', details: error.message })
    };
  }
};
