# YouTube Captions Summarizer
**Link to Site:**  
[http://18.237.75.195:3000/](http://18.237.75.195:3000/)

**Link to ML Model I Trained from Scratch:**  
[http://18.237.75.195:3000/my-model-notebook](http://18.237.75.195:3000/my-model-notebook)

**Note:** This site is currently not using HTTPS (secure connection).

## Directory Structure

- `script.js`: Handles requests to the server and updating HTML items in the DOM.
- `server.js`: Main server setup and API routes.
- `Transcript.js`: Responsible for parsing and extraction of YouTube captions through scraping.
- `OpenAiApi.js`: Manages interactions with the OpenAI API and sets prompts.
- `generateSummary.js`: This module likely facilitates the generation of summaries using OpenAI's API.



## Setup to run Node App from Local

1. Clone the repository:

```bash
git clone [your-repository-url]
```
2. Install dependencies:

```bash   
npm install
```

3. Setup your environment variables:
Create a .env file in the root directory of your project and add the following:

```bash
API_KEY=your_openai_api_key_here
```

5. Start the server:
   
```bash
node server.js
```
6. Once the server starts, you should see the message:
Server is running on http://localhost:3000



## Setup to run Node App by Hosting a Server

# Using AWS Lightsail
https://hrboka.medium.com/setting-up-a-node-website-on-apache-with-aws-lightsail-8dfac2c4467d

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
