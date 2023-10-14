const Transcript = require('./Transcript.js');
const fs = require('fs');
const GenerateSummary = require('./generateSummary.js');
require('dotenv').config();
const apiKey = process.env.API_KEY;

//const Transcript = require('./Summary.js');

const express = require('express');


let fetch;
import('node-fetch').then(module => {
    fetch = module.default;
});
const app = express();
const PORT = 3000;


// Serve static files from 'public' directory
app.use(express.static('public'));

// Captions API route
app.get('/captions', async (req, res) => {
    const videoId = req.query.videoId;
    const WATCH_URL = `https://www.youtube.com/watch?v=${videoId}`;

    try {
        const response = await fetch(WATCH_URL);
        const html = await response.text();

        const splitHtml = html.split('"captions":');
        if (splitHtml.length <= 1) {
            return res.status(404).send("No captions found.");
        }

        const jsonDataStr = splitHtml[1].split(',"videoDetails')[0].replace('\n', '');
        const captionsJson = JSON.parse(jsonDataStr);
        
        // Initialize Transcript object with necessary data
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
        
        // Return the fetched transcript data
        return res.json(transcriptData);
    } catch (error) {
        console.error("Error fetching captions:", error);
        return res.status(500).send("Failed to fetch caption data.");
    }

});


app.get('/generateSummary', async (req, res) => {
    try {
        console.log('Starting summary generation...');
        
        // Start the timer with a label 'Summary Generation'
        console.time('Summary Generation');

        const generateSummary = new GenerateSummary(apiKey);
        await generateSummary.generate('captions.txt', 'summary.txt');
        
        // End the timer and it will automatically log the time taken
        console.timeEnd('Summary Generation');
        
        res.sendStatus(200);
    } catch (error) {
        console.error("Error during summary generation:", error);
        res.status(500).send('Error generating summary.');
    }
});

app.get('/getSummary', (req, res) => {
    fs.readFile('summary.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading summary.');
        } else {
            res.send(data);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
