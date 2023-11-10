const Transcript = require('./Transcript.js');
const GenerateSummary = require('./generateSummary.js');
const YouTubeService = require('./youtube.service.js');
require('dotenv').config();
const apiKey = process.env.API_KEY;
const express = require('express');
const { engine } = require('express-handlebars');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;
let youtubeService;


import('node-fetch').then(module => {
    const fetch = module.default;

    // Initialize YouTubeService with fetch
    youtubeService = new YouTubeService(fetch);

    // ===================================
    // SETUP
    // ===================================

    // Serve static files from the 'public' directory
    app.use(express.static('public'));
    app.engine('.hbs', engine({
        defaultLayout: 'main', // Ensure you have a main layout file defined or remove this line if not
        layoutsDir: 'views/layouts', // Ensure you have this directory structure if you use layouts
        partialsDir: 'views/partials', // Only required if you have partials
        extname: '.hbs', // Set the file extension to .hbs

        extname: '.hbs',
        helpers: {
            if_eq: function (a, b, opts) {
                if (a === b) {
                    return opts.fn(this);
                } else {
                    return opts.inverse(this);
                }
            }
        }
    }));
    
    app.set('view engine', '.hbs'); // Updated to use .hbs extension
    app.set('views', './views');

    app.use(express.json());  // <- This line is crucial for parsing the request body

    // ===================================
    // SERVER INITIALIZATION
    // ===================================
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });


    // ===================================
    // ROUTES
    // ===================================

    // Captions API route
    app.get('/captions', async (req, res) => {
        const videoId = req.query.videoId;
        const captionType = req.query.captionType || 'SRT'; // Default to 'SRT' if not provided

        try {
        const captions = await youtubeService.fetchCaptions(videoId, captionType);
        return res.json(captions);
        } catch (error) {
        console.error("Error fetching captions:", error.message);
        return res.status(500).send(error.message);
        }
    });

    /**
     * Endpoint to generate a summary from the fetched captions.
     */
    app.post('/generateSummary', async (req, res) => {
        try {
            console.log('Starting summary generation...');
            console.time('Summary Generation');

            const videoId = req.body.videoId; // Assuming the videoId will be sent in the request
            const captionType = req.body.captionType || 'SRT'; // Default to SRT if nothign provided

            let captionsData = req.body.captions;


            // If no captions are provided, fetch them first
            if (!captionsData && videoId) {
            try {
                    //Utilize Youtube.Service for caption extraction
                    captionsData = await youtubeService.fetchCaptions(videoId, captionType);

                } catch (error) {
                    console.error("Error fetching captions:", error.message);
                    return res.status(500).send(error.message);
                }
            }

            // If, after trying, there are still no captions, return an error
            if (!captionsData) {
                return res.status(400).send('No captions found or provided.');
            }
            console.log(captionsData)
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

            let captionsData = req.body.captions;
            const keyword = req.body.keyword;
            const captionType = req.body.captionType || 'SRT'; // Add this line to get captionType from request
            const videoId = req.body.videoId; // Assuming the videoId will be sent in the request

            // If no captions are provided, fetch them first
            if (!captionsData && videoId) {
                try {
                        //Utilize Youtube.Service for caption extraction
                        captionsData = await youtubeService.fetchCaptions(videoId, captionType);
    
                    } catch (error) {
                        console.error("Error fetching captions:", error.message);
                        return res.status(500).send(error.message);
                    }
                }
    
            const generateSummary = new GenerateSummary(apiKey);
            const searchResult = await generateSummary.search(captionsData, keyword);
            
            console.timeEnd('Search Generation');
            
            res.send(searchResult);

        } catch (error) {
            console.error("Error during search generation:", error);
            res.status(500).send('Error generating search result.');
        }
    });

    app.get('/', (req, res) => {
        res.render('index', {
            active: 'index'
        });
    });
    
    // Routes for new pages
    app.get('/llama2-model', (req, res) => {
        res.render('llama2-model', {
            active: 'llama2-model'
        });
    });

    app.get('/punctuation-model', (req, res) => {
        res.render('punctuation-model', {
            active: 'punctuation-model'
        });
    });

    app.get('/GPT-model', (req, res) => {
        res.render('GPT-model', {
            active: 'GPT-model'
        });
    });
    
    app.get('/picture-model', (req, res) => {
        res.render('picture-model', {
            active: 'picture-model'
        });
    });

    app.get('/bart-model', (req, res) => {
        res.render('bart-model', {
            active: 'bart-model'
        });
    });


}).catch(err => {
    console.error("Failed to load 'node-fetch' module", err);
});