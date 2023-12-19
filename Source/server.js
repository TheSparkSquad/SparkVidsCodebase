const Transcript = require('./Transcript.js');
const { processText, truncateContent } = require('./textpreprocessing.service');
const OpenAiApi = require('./openAiApi'); //  OpenAiApi class
const YouTubeService = require('./youtube.service.js');
require('dotenv').config();
const session = require('express-session');
const express = require('express');
const { engine } = require('express-handlebars');
const openaiApiKey = process.env.OPENAI_API_KEY;
const huggingApiKey = process.env.HUGGINGFACE_API_TOKEN

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
    app.use(session({
        secret: 'your secret key', // Secret key for signing the session ID cookie
        resave: false, // Don't save session if unmodified
        saveUninitialized: true, // Save uninitialized session
        cookie: { secure: false } // Set to true if using HTTPS, else false
    }));
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

    // Factory for API endpoints
    function getApiEndpoint(apiName) {
        switch (apiName) {
            case 'openai':
                return new OpenAiApi(openaiApiKey);
            // ... (other cases) ...
            default:
                throw new Error('Unknown API endpoint');
        }
    }


    // ===================================
    // ROUTES
    // ===================================

    /**
     * GET /captions
     * Fetches captions for a given YouTube video.
     * Expects 'videoId' and optional 'captionType' (default 'SRT') in query parameters.
     */
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
     * POST /generateSummary
     * Generates a summary for the provided YouTube video captions.
     * Expects 'videoId', 'captionType' (optional, default 'SRT'), 'apiName', and 'summaryType' (optional, default 'TXT') in request body.
     */
    app.post('/generateSummary', async (req, res) => {
        try {
            console.log(req.session); // Check what's in the session

            console.log('Starting summary generation...');
            console.time('Summary Generation');

            const { videoId, captionType = 'SRT', summaryType = 'TXT' } = req.body;

            let captionsData = await youtubeService.fetchCaptions(videoId, captionType);
            captionsData = processText(captionsData);
            captionsData = truncateContent(captionsData, 8000);
            const apiName = req.session.apiName;
            console.log(`apiName: ${apiName}`)
            const apiEndpoint = getApiEndpoint(apiName);
            const summary = await apiEndpoint.generateSummary(captionsData, summaryType);
            console.timeEnd('Summary Generation');

            res.send(summary);
        } catch (error) {
            console.error("Error during summary generation:", error);
            res.status(500).send('Error generating summary.');
        }
    });



    /**
     * POST /generateSearch
     * Performs a keyword search within the captions of a YouTube video.
     * Expects 'videoId', 'captionType' (optional, default 'SRT'), 'apiName', 'keyword', and optionally 'captionsData' in request body.
     */
    app.post('/generateSearch', async (req, res) => {
        try {
            console.log('Starting Search generation...');
    
            let captionsData = req.body.captions;
            const keyword = req.body.keyword;
            const captionType = req.body.captionType || 'SRT';
            const videoId = req.body.videoId;
            const apiName = req.session.apiName; // Add this to get the API name from request

            // If no captions are provided, fetch them first
            if (!captionsData && videoId) {
                try {
                    captionsData = await youtubeService.fetchCaptions(videoId, captionType);
                } catch (error) {
                    console.error("Error fetching captions:", error.message);
                    return res.status(500).send(error.message);
                }
            }
    
            // Get the appropriate API endpoint
            const apiEndpoint = getApiEndpoint(apiName);
            
            // Use the API endpoint to generate the search result
            const searchResult = await apiEndpoint.generateSearch(captionsData, keyword);
            
            res.send(searchResult);
    
        } catch (error) {
            console.error("Error during search generation:", error);
            res.status(500).send('Error generating search result.');
        }
    });
    
    /**
     * GET /
     * Serves the index page of the application.
     */
    app.get('/', (req, res) => {
        req.session.apiName = 'openai'; // Set 'openai' as the apiName in the session
        res.render('index', {
            active: 'index'
        });
    });
    
    // Routes for new pages
    app.get('/llama2-model', (req, res) => {
        res.render('llama2-model', {
            active: 'llama2-model',
            cardNote: "Utilizing Llama 2's LLM API"
        });
    });

    app.get('/punctuation-model', (req, res) => {
        res.render('punctuation-model', {
            active: 'punctuation-model',
            cardNote: "Utilizing Hugging Face's Deep Multilingual Punctuation model to puntuate caption data."

        });
    });

    app.get('/GPT-model', (req, res) => {
        req.session.apiName = 'openai'; // Set 'openai' as the apiName in the session
        res.render('GPT-model', {
            active: 'GPT-model',
            cardNote: "Utilizing Chat GPT's LLM API"
        });
    });

    app.get('/bart-model', (req, res) => {
        res.render('bart-model', {
            active: 'bart-model',
            cardNote: "Utilizing CNN Large Bart to Generate Short Summaries"
        });
    });


}).catch(err => {
    console.error("Failed to load 'node-fetch' module", err);
});