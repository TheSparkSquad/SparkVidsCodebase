# YouTube Captions Summarizer

This project is designed to fetch and extract captions from a YouTube video and then generate a concise summary of those captions. It uses YouTube scraping for fetching captions and the OpenAI API to generate the summary.

## Directory Structure

- `script.js`: Handles requests to the server and updating HTML items in the DOM.
- `server.js`: Main server setup and API routes.
- `Transcript.js`: Responsible for parsing and extraction of YouTube captions through scraping.
- `OpenAiApi.js`: Manages interactions with the OpenAI API and sets prompts.
- `generateSummary.js`: (Not explicitly provided in the code but inferred) This module likely facilitates the generation of summaries using OpenAI's API.

## Setup

1. Clone the repository:
```bash
git clone [your-repository-url]

2. Install dependencies:
npm install

3. Setup your environment variables:
Create a .env file in the root directory of your project and add the following:
API_KEY=your_openai_api_key_here

4. Start the server:
node server.js

5. Once the server starts, you should see the message:
Server is running on http://localhost:3000


## API Routes

### Fetch Captions

- **Method:** GET
- **Endpoint:** `/captions`
- **Query Parameter:** `videoId` (The ID of the YouTube video from which you want to fetch captions)
- **Response:** Returns the fetched transcript data in JSON format.

### Generate Summary

- **Method:** POST
- **Endpoint:** `/generateSummary`
- **Request Body:** 
  ```json
  {
    "captions": [captionsData...]
  }

**Response:** Returns a summarized content based on the captions data.

## Contribute

Feel free to dive in! Open an issue or submit PRs.

## License

MIT © [Your Name]
