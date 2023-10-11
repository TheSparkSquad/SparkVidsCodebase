const Transcript = require('./Transcript.js');
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
