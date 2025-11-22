// Function that Netlify executes when the browser calls the endpoint
exports.handler = async (event, context) => {
  // 1. ACCESS THE SECRET KEY
  // **CHANGE THE NAME BELOW TO YOUR NETLIFY VARIABLE NAME**
  const apiKey = process.env.MY_API_KEY; 
  
  // 2. BUILD THE API REQUEST URL
  // **REPLACE THIS ENTIRE STRING WITH THE CORRECT GEMINI ENDPOINT**
  const externalApiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  try {
    // 3. FETCH DATA SECURELY
    // Note: If you send image data from the browser, you must switch this to a POST request
    // and include the image data from event.body in the fetch options.
    const response = await fetch(externalApiUrl);
    
    if (!response.ok) {
      return { statusCode: response.status, body: 'Error calling external API.' };
    }
    
    const data = await response.json();

    // 4. RETURN THE DATA TO THE BROWSER
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};

