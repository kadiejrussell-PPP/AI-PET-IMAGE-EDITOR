
AI Pet Image Editor - Netlify Version
====================================

What's included:
 - index.html (frontend with voice input, many preset backgrounds, preview & download)
 - netlify.toml (Netlify config)
 - netlify/functions/generate.js (serverless function that calls Gemini Vision)
 - logo.png (placeholder) -> Replace with your real logo file before deploying

How to deploy to Netlify (quick):
1. Replace logo.png with your real logo image (same filename) in the project root.
2. Zip the project directory or push it to a GitHub repository.
3. On Netlify, create a new site -> Import from GitHub OR Drag & Drop the ZIP (Manual deploy).
   - If manual deploy, Netlify expects a 'publish' directory. index.html is at root; Netlify will serve root files.
4. In Site Settings -> Environment Variables, add:
   - GEMINI_API_KEY = your-google-gemini-api-key
5. Deploy or re-deploy the site.
6. Open the site, upload a pet image, choose background, speak or type prompt, press Generate.

Important security note:
 - The GEMINI_API_KEY MUST be set in Netlify's environment variables (not hardcoded).
 - Do not commit your secret key to GitHub in plain text.

If the Gemini response shape differs from this function's parsing, we'll adapt the function to the exact response format returned by your project test calls.
