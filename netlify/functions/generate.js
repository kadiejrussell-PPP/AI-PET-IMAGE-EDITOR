import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server missing GEMINI_API_KEY' }) };
    }

    const { image, prompt } = JSON.parse(event.body);
    // Expect image as data URL, convert to base64 payload without prefix
    const b64 = image.split(',')[1];

    // Build Gemini request body for Vision + Text prompt
    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/png", data: b64 } }
        ]
      }]
    };

    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      }
    );

    const data = await resp.json();

    // Attempt to extract base64 image from response candidates
    // Depending on API shape, adapt: here we look for content with inline_data or image bytes
    let image_b64 = null;
    if (data?.candidates) {
      for (const cand of data.candidates) {
        if (cand?.content?.parts) {
          for (const p of cand.content.parts) {
            if (p.image_b64) {
              image_b64 = p.image_b64;
              break;
            }
            if (p.inline_image && p.inline_image.image_bytes) {
              image_b64 = p.inline_image.image_bytes;
              break;
            }
          }
        }
      }
    }

    // Fallback: if server provides a hosted URL
    const imageUrl = data?.candidates?.[0]?.content?.parts?.[0]?.image_url || null;

    return {
      statusCode: 200,
      body: JSON.stringify({ image_b64, imageUrl })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
}
