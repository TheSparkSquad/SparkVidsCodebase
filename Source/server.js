const Transcript = require('./Transcript.js');
const GenerateSummary = require('./generateSummary.js');
require('dotenv').config();
const apiKey = process.env.API_KEY;
const express = require('express');

let fetch;
import('node-fetch').then(module => {
    fetch = module.default;
});
const app = express();
const PORT = 3000;
// ===================================
// SETUP
// ===================================

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.json());  // <- This line is crucial for parsing the request body

// ===================================
// ROUTES
// ===================================

// Captions API route
app.get('/captions', async (req, res) => {

    // Extract videoId from the query parameters
    const videoId = req.query.videoId;
    const WATCH_URL = `https://www.youtube.com/watch?v=${videoId}`;

    try {
        // Fetch the video's HTML content
        const response = await fetch(WATCH_URL);
        const html = await response.text();

        // Extract captions data from HTML
        const splitHtml = html.split('"captions":');
        if (splitHtml.length <= 1) {
            return res.status(404).send("No captions found.");
        }

        // Extract and parse JSON data for captions
        const jsonDataStr = splitHtml[1].split(',"videoDetails')[0].replace('\n', '');
        const captionsJson = JSON.parse(jsonDataStr);
        
        // Create a Transcript instance and fetch captions data
        const transcript = new Transcript(
            fetch, 
            videoId, 
            WATCH_URL, 
            "English", 
            "en", 
            true, 
            [] // For simplicity, not handling translation languages here
        );
        // Fetch the captions using the new method
        const transcriptData = await transcript.fetchCaptionsFromData(captionsJson);
        //console.log(transcriptData)
        // Return the fetched transcript data as a response
        return res.json(transcriptData);
    } catch (error) {
        console.error("Error fetching captions:", error);
        return res.status(500).send("Failed to fetch caption data.");
    }
});


/**
 * Endpoint to generate a summary from the fetched captions.
 */
app.post('/generateSummary', async (req, res) => {
    try {
        console.log('Starting summary generation...');
        console.time('Summary Generation');

        let captionsData = req.body.captions;
        const videoId = req.body.videoId; // Assuming the videoId will be sent in the request

        // If no captions are provided, fetch them first
        if (!captionsData && videoId) {
            // Note: Directly using the logic from '/captions' endpoint. 
            // In a real-world application, you might want to refactor this to avoid duplication.
            const WATCH_URL = `https://www.youtube.com/watch?v=${videoId}`;
            const response = await fetch(WATCH_URL);
            const html = await response.text();
            const splitHtml = html.split('"captions":');
            if (splitHtml.length > 1) {
                const jsonDataStr = splitHtml[1].split(',"videoDetails')[0].replace('\n', '');
                const captionsJson = JSON.parse(jsonDataStr);
                const transcript = new Transcript(
                    fetch, 
                    videoId, 
                    WATCH_URL, 
                    "English", 
                    "en", 
                    true, 
                    []
                );
                captionsData = await transcript.fetchCaptionsFromData(captionsJson);
            }
        }

        // If, after trying, there are still no captions, return an error
        if (!captionsData) {
            return res.status(400).send('No captions found or provided.');
        }

        const generateSummary = new GenerateSummary(apiKey);
        const summary = await generateSummary.generate(captionsData);
        
        console.timeEnd('Summary Generation');
        res.send(summary);

    } catch (error) {
        console.error("Error during summary generation:", error);
        res.status(500).send('Error generating summary.');
    }
});



app.post('/generateSearch', async (req, res) => {
    try {
        console.log('Starting Search generation...');
        console.time('Search Generation');

        const captionsData = req.body.captions;
        const keyword = req.body.keyword;

        const generateSummary = new GenerateSummary(apiKey);
        const searchResult = await generateSummary.search(captionsData, keyword);
        
        console.timeEnd('Search Generation');
        
        res.send(searchResult);

    } catch (error) {
        console.error("Error during search generation:", error);
        res.status(500).send('Error generating search result.');
    }
});

// Routes for new pages
app.get('/llama2-model', (req, res) => {
    res.sendFile(__dirname + '/public/llama2-model.html');
});

app.get('/punctuation-model', (req, res) => {
    res.sendFile(__dirname + '/public/punctuation-model.html');
});
app.get('/simple', (req, res) => {
    res.sendFile(__dirname + '/public/punctuation-model.html');
});

// ===================================
// SERVER INITIALIZATION
// ===================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});