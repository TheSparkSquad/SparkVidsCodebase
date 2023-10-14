const Transcript = require('./Transcript.js');
const fs = require('fs');
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
            [] // For simplicity, not handling translation languages in this example
        );

        // Fetch the captions using the new method
        const transcriptData = await transcript.fetchCaptionsFromData(captionsJson);
        
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
app.get('/generateSummary', async (req, res) => {
    try {
        console.log('Starting summary generation...');
        
        // Measure time taken for summary generation
        console.time('Summary Generation');

        const generateSummary = new GenerateSummary(apiKey);
        await generateSummary.generate('captions.txt', 'summary.txt');
        
        // End time measurement and log result
        console.timeEnd('Summary Generation');
        
        res.sendStatus(200);
    } catch (error) {
        console.error("Error during summary generation:", error);
        res.status(500).send('Error generating summary.');
    }
});

/**
 * Endpoint to retrieve the generated summary.
 */
app.get('/getSummary', (req, res) => {
    fs.readFile('summary.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading summary.');
        } else {
            res.send(data);
        }
    });
});

// ===================================
// SERVER INITIALIZATION
// ===================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
